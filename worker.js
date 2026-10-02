const ID_RE = /^[A-Za-z0-9_-]{10,100}$/;

const PARENT_Q_RE = /^'[A-Za-z0-9_-]{10,100}' in parents and trashed = false$/;

const NAME_Q_RE = /^name contains '(?:[^'\\]|\\.)*' and trashed = false$/;

const ADMIN_MODES = [ "list_cache", "purge_logos", "forget", "warm", "grant" ];

const MAX_COVER_BYTES = 3 * 1024 * 1024;

const COVER_TYPES = [ "image/jpeg", "image/png", "image/webp" ];

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const UPSTREAM_RETRY_STATUSES = new Set([ 408, 425, 429, 500, 502, 503, 504 ]);

const sleepMs = ms => new Promise(resolve => setTimeout(resolve, ms));

function upstreamRetryDelay(response, attempt) {
    const raw = response?.headers?.get("Retry-After");
    if (raw) {
        const seconds = Number(raw);
        const dateMs = Number.isFinite(seconds) ? seconds * 1e3 : Date.parse(raw) - Date.now();
        if (Number.isFinite(dateMs) && dateMs >= 0) return Math.min(8e3, dateMs);
    }
    return Math.min(2500, 300 * 2 ** (attempt - 1) + Math.random() * 250);
}

async function fetchUpstreamWithRetry(input, init = {}, options = {}) {
    const attempts = options.attempts ?? 3;
    const timeoutMs = options.timeoutMs ?? 2e4;
    const externalSignal = init.signal;
    const host = (() => {
        try {
            return new URL(input).hostname;
        } catch (_) {
            return "upstream";
        }
    })();
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        const controller = new AbortController;
        const onExternalAbort = () => controller.abort();
        if (externalSignal) {
            if (externalSignal.aborted) controller.abort(); else externalSignal.addEventListener("abort", onExternalAbort, {
                once: true
            });
        }
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        let response;
        try {
            response = await fetch(input, {
                ...init,
                signal: controller.signal
            });
        } catch (error) {
            lastError = error;
            clearTimeout(timer);
            if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
            if (externalSignal?.aborted || attempt >= attempts) throw error;
            console.warn("[PlanetaHQ Worker] upstream network retry", host, attempt, String(error?.message || error));
            await sleepMs(upstreamRetryDelay(null, attempt));
            continue;
        }
        clearTimeout(timer);
        if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
        let retry = UPSTREAM_RETRY_STATUSES.has(response.status);
        if (response.status === 403) {
            const body = await response.clone().text().catch(() => "");
            retry = /rateLimitExceeded|userRateLimitExceeded|quotaExceeded/i.test(body);
        }
        if (!retry || attempt >= attempts) return response;
        const wait = upstreamRetryDelay(response, attempt);
        console.warn("[PlanetaHQ Worker] upstream HTTP retry", host, response.status, attempt, "waitMs=" + Math.round(wait));
        try {
            await (response.body?.cancel());
        } catch (_) {}
        await sleepMs(wait);
    }
    throw lastError || new Error("Upstream indisponível após novas tentativas.");
}

const MAX_DEVICES_PER_CODE = 4;

const DEVICE_LAST_USED_WRITE_INTERVAL_MS = 5 * 60 * 1e3;

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders()
            });
        }
        if (request.method === "POST" && url.pathname === "/gg-webhook") {
            return handleGgWebhook(request, env);
        }
        if (url.searchParams.get("auth_check") === "1") {
            const code = normalizeCode(url.searchParams.get("code") || "");
            const deviceId = (url.searchParams.get("device") || "").slice(0, 100);
            const deviceType = (url.searchParams.get("type") || "").slice(0, 20);
            const result = await checkAndRegisterDevice(code, deviceId, deviceType, env, {
                touchLastUsed: true
            });
            return new Response(JSON.stringify(result), {
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (url.searchParams.get("list_devices") === "1") {
            const code = normalizeCode(url.searchParams.get("code") || "");
            const thisDevice = (url.searchParams.get("device") || "").slice(0, 100);
            const list = await listDevices(code, env);
            if (list === null) {
                return new Response(JSON.stringify({
                    error: "Código de acesso inválido."
                }), {
                    status: 401,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
            return new Response(JSON.stringify({
                max: MAX_DEVICES_PER_CODE,
                devices: list.map(d => ({
                    id: d.id,
                    lastUsed: d.lastUsed,
                    type: d.type || "",
                    isThis: d.id === thisDevice
                }))
            }), {
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (url.searchParams.get("remove_device") === "1") {
            const code = normalizeCode(url.searchParams.get("code") || "");
            const removeId = (url.searchParams.get("remove_id") || "").slice(0, 100);
            const ok = await removeDevice(code, removeId, env);
            if (!ok) {
                return new Response(JSON.stringify({
                    error: "Código de acesso inválido."
                }), {
                    status: 401,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
            return new Response(JSON.stringify({
                removed: true
            }), {
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (ADMIN_MODES.some(m => url.searchParams.get(m) === "1")) {
            const given = request.headers.get("X-Admin-Token") || url.searchParams.get("key") || "";
            if (!env.ADMIN_TOKEN || !given || !safeEqual(given, env.ADMIN_TOKEN)) {
                return new Response("Não autorizado.", {
                    status: 401,
                    headers: corsHeaders()
                });
            }
        }
        if (url.searchParams.get("drive_list") === "1") {
            const denied = await requireAccessCode(url, env);
            if (denied) return denied;
            return handleDriveList(url, env);
        }
        if (url.searchParams.get("grant") === "1") {
            const email = (url.searchParams.get("email") || "").trim().toLowerCase();
            let code;
            if (email && EMAIL_RE.test(email)) {
                const emailKey = `email:${email}`;
                code = await env.ACCESS_CODES.get(emailKey);
                if (!code) {
                    code = generateCode();
                    await env.ACCESS_CODES.put(`access:${code}`, JSON.stringify({
                        email: email,
                        createdAt: Date.now(),
                        devices: []
                    }));
                    await env.ACCESS_CODES.put(emailKey, code);
                }
            } else {
                code = generateCode();
                await env.ACCESS_CODES.put(`access:${code}`, JSON.stringify({
                    email: email || null,
                    createdAt: Date.now(),
                    devices: []
                }));
            }
            let emailed = false;
            if (email && EMAIL_RE.test(email) && env.BREVO_API_KEY) {
                try {
                    await sendAccessCodeEmail(env, email, formatCode(code));
                    emailed = true;
                } catch (e) {}
            }
            return new Response(JSON.stringify({
                code: formatCode(code),
                email: email || null,
                emailed: emailed
            }), {
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (url.searchParams.get("list_cache") === "1") {
            try {
                const cursor = url.searchParams.get("cursor") || undefined;
                const listing = await env.COMIC_CACHE.list({
                    prefix: "drive/",
                    cursor: cursor,
                    limit: 1e3
                });
                return new Response(JSON.stringify({
                    keys: listing.objects.map(o => o.key),
                    truncated: !!listing.truncated,
                    cursor: listing.truncated ? listing.cursor : null
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    error: String(e)
                }), {
                    status: 500,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        const LOGOS = {
            aranha: "https://i.postimg.cc/T2BgjCPP/amazing-spiderman-seeklogo.png",
            xmen: "https://i.postimg.cc/cJzP2j41/x-men-seeklogo.png",
            batman: "https://i.postimg.cc/vBNHsqK1/IMG-20260914-002543.png",
            hulk: "https://i.postimg.cc/SQTJZ8Lv/kindpng-1834284.png",
            lanterna: "https://i.postimg.cc/QNwj9qJK/Green-Lantern-Logo-Light-Green-Text-png.png",
            ironman: "https://i.postimg.cc/8zjYnDTh/pngaaa-com-912238.png",
            superman: "https://i.postimg.cc/Qty9mpmS/superman-seeklogo.png",
            dc: "https://i.postimg.cc/Dygkx1bZ/DC-Comics-2024-svg.png",
            mulhermaravilha: "https://i.postimg.cc/dVLHGCRP/584297fea6515b1e0ad75ad9.png",
            doomsday: "https://i.postimg.cc/jdGNkJVp/ncg-Hq-Zl-YPOb-Q0y6f-Moh1ib-Qnqgt.png"
        };
        if (url.searchParams.get("logo_list") === "1") {
            return new Response(JSON.stringify({
                names: Object.keys(LOGOS)
            }), {
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (url.searchParams.get("purge_logos") === "1") {
            try {
                const listing = await env.COMIC_CACHE.list({
                    prefix: "logo/"
                });
                const keys = listing.objects.map(o => o.key);
                if (keys.length) await env.COMIC_CACHE.delete(keys);
                return new Response(JSON.stringify({
                    purged: keys.length
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    purged: 0,
                    error: String(e)
                }), {
                    status: 500,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        const logoName = url.searchParams.get("logo");
        if (logoName) {
            const sourceUrl = LOGOS[logoName];
            if (!sourceUrl) {
                return new Response("Logo desconhecida: " + logoName, {
                    status: 404,
                    headers: corsHeaders()
                });
            }
            const logoFileName = sourceUrl.split("/").pop();
            const logoKey = `logo/${logoFileName}`;
            try {
                const obj = await env.COMIC_CACHE.get(logoKey);
                if (obj) {
                    const headers = new Headers(corsHeaders());
                    headers.set("Content-Type", obj.httpMetadata?.contentType || "image/png");
                    headers.set("Cache-Control", "public, max-age=31536000, immutable");
                    return new Response(obj.body, {
                        status: 200,
                        headers: headers
                    });
                }
            } catch (e) {}
            try {
                const srcRes = await fetch(sourceUrl, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                        Referer: "https://postimg.cc/"
                    }
                });
                if (!srcRes.ok) {
                    return new Response("Falha ao buscar a logo na origem (HTTP " + srcRes.status + ").", {
                        status: 502,
                        headers: corsHeaders()
                    });
                }
                const contentType = srcRes.headers.get("Content-Type") || "image/png";
                const bytes = await srcRes.arrayBuffer();
                try {
                    await env.COMIC_CACHE.put(logoKey, bytes, {
                        httpMetadata: {
                            contentType: contentType
                        }
                    });
                } catch (e) {}
                return new Response(bytes, {
                    status: 200,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": contentType,
                        "Cache-Control": "public, max-age=31536000, immutable"
                    }
                });
            } catch (e) {
                return new Response("Falha de rede ao buscar a logo. " + String(e), {
                    status: 502,
                    headers: corsHeaders()
                });
            }
        }
        const fileId = url.searchParams.get("id");
        if (!fileId) {
            return new Response('Faltou o parâmetro "id" na URL.', {
                status: 400,
                headers: corsHeaders()
            });
        }
        if (!ID_RE.test(fileId)) {
            return new Response('Parâmetro "id" inválido.', {
                status: 400,
                headers: corsHeaders()
            });
        }
        const hasValidAdminToken = !!(env.ADMIN_TOKEN && safeEqual(request.headers.get("X-Admin-Token") || "", env.ADMIN_TOKEN));
        if (url.searchParams.get("warm") !== "1" && !hasValidAdminToken) {
            const denied = await requireAccessCode(url, env);
            if (denied) return denied;
        }
        const rangeHeader = request.headers.get("Range");
        const cacheKey = `drive/${fileId}`;
        const coverKey = `cover/${fileId}`;
        if (url.searchParams.get("cover_check") === "1") {
            try {
                const head = await env.COMIC_CACHE.head(coverKey);
                return new Response(JSON.stringify({
                    cached: !!head
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    cached: false
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        if (url.searchParams.get("cover") === "1") {
            try {
                const obj = await env.COMIC_CACHE.get(coverKey);
                if (!obj) {
                    return new Response(JSON.stringify({
                        error: "not_found"
                    }), {
                        status: 404,
                        headers: {
                            ...corsHeaders(),
                            "Content-Type": "application/json"
                        }
                    });
                }
                const headers = new Headers(corsHeaders());
                headers.set("Content-Type", obj.httpMetadata?.contentType || "image/jpeg");
                headers.set("Cache-Control", "public, max-age=31536000, immutable");
                headers.set("Content-Length", String(obj.size));
                return new Response(obj.body, {
                    status: 200,
                    headers: headers
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    error: String(e)
                }), {
                    status: 500,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        if (url.searchParams.get("cover_put") === "1") {
            if (request.method !== "PUT") {
                return new Response("Método não permitido.", {
                    status: 405,
                    headers: corsHeaders()
                });
            }
            const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
            if (!COVER_TYPES.includes(contentType)) {
                return new Response("Tipo de arquivo não permitido.", {
                    status: 415,
                    headers: corsHeaders()
                });
            }
            const declared = Number(request.headers.get("Content-Length") || 0);
            if (!declared || declared > MAX_COVER_BYTES) {
                return new Response("Tamanho inválido.", {
                    status: 413,
                    headers: corsHeaders()
                });
            }
            try {
                if (await env.COMIC_CACHE.head(coverKey)) {
                    return new Response(JSON.stringify({
                        saved: false,
                        alreadyCached: true
                    }), {
                        headers: {
                            ...corsHeaders(),
                            "Content-Type": "application/json"
                        }
                    });
                }
                const bytes = await request.arrayBuffer();
                if (bytes.byteLength > MAX_COVER_BYTES) {
                    return new Response("Tamanho inválido.", {
                        status: 413,
                        headers: corsHeaders()
                    });
                }
                await env.COMIC_CACHE.put(coverKey, bytes, {
                    httpMetadata: {
                        contentType: contentType
                    }
                });
                return new Response(JSON.stringify({
                    saved: true
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    saved: false,
                    error: String(e)
                }), {
                    status: 500,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        if (url.searchParams.get("forget") === "1") {
            try {
                await env.COMIC_CACHE.delete(cacheKey);
                return new Response(JSON.stringify({
                    forgotten: true
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    forgotten: false,
                    error: String(e)
                }), {
                    status: 500,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        if (url.searchParams.get("warm") === "1") {
            try {
                const already = await env.COMIC_CACHE.head(cacheKey);
                if (already) {
                    return new Response(JSON.stringify({
                        cached: true,
                        alreadyCached: true
                    }), {
                        headers: {
                            ...corsHeaders(),
                            "Content-Type": "application/json"
                        }
                    });
                }
            } catch (e) {}
            if (!env.DRIVE_API_KEY) {
                return new Response("DRIVE_API_KEY não configurada no Worker.", {
                    status: 500,
                    headers: corsHeaders()
                });
            }
            const driveUrl = driveMediaUrl(fileId, env);
            try {
                const driveRes = await fetchUpstreamWithRetry(driveUrl, {}, {
                    attempts: 3,
                    timeoutMs: 25e3
                });
                if (!driveRes.ok) {
                    const bodyText = await driveRes.text().catch(() => "");
                    return new Response(JSON.stringify({
                        cached: false,
                        error: bodyText || `HTTP ${driveRes.status}`
                    }), {
                        status: driveRes.status,
                        headers: {
                            ...corsHeaders(),
                            "Content-Type": "application/json"
                        }
                    });
                }
                const contentType = driveRes.headers.get("Content-Type") || "application/octet-stream";
                await putStreamToR2(env.COMIC_CACHE, cacheKey, driveRes.body, contentType);
                return new Response(JSON.stringify({
                    cached: true
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    cached: false,
                    error: String(e)
                }), {
                    status: 502,
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        if (url.searchParams.get("check") === "1") {
            try {
                const head = await env.COMIC_CACHE.head(cacheKey);
                return new Response(JSON.stringify({
                    cached: !!head,
                    size: head ? head.size : null
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({
                    cached: false
                }), {
                    headers: {
                        ...corsHeaders(),
                        "Content-Type": "application/json"
                    }
                });
            }
        }
        try {
            const range = rangeHeader ? parseRange(rangeHeader) : undefined;
            const obj = await env.COMIC_CACHE.get(cacheKey, range ? {
                range: range
            } : {});
            if (obj) {
                console.log(`RANGE_LOG id=${fileId} range=${rangeHeader || "(sem range, arquivo inteiro)"}`);
                return objectToResponse(obj, !!rangeHeader);
            }
        } catch (e) {}
        if (!env.DRIVE_API_KEY) {
            return new Response("DRIVE_API_KEY não configurada no Worker.", {
                status: 500,
                headers: corsHeaders()
            });
        }
        const driveUrl = driveMediaUrl(fileId, env);
        const driveFetchHeaders = {};
        if (rangeHeader) driveFetchHeaders["Range"] = rangeHeader;
        let driveRes;
        try {
            driveRes = await fetchUpstreamWithRetry(driveUrl, {
                headers: driveFetchHeaders
            }, {
                attempts: 3,
                timeoutMs: 25e3
            });
        } catch (e) {
            console.error("[PlanetaHQ Worker] Drive media upstream failed after retries:", String(e?.message || e));
            return new Response("Falha temporária ao acessar o Google Drive. Tente novamente.", {
                status: 502,
                headers: corsHeaders()
            });
        }
        if (!driveRes.ok && driveRes.status !== 206) {
            const bodyText = await driveRes.text().catch(() => "");
            return new Response(bodyText, {
                status: driveRes.status,
                headers: corsHeaders()
            });
        }
        const contentType = driveRes.headers.get("Content-Type") || "application/octet-stream";
        const contentLength = driveRes.headers.get("Content-Length");
        const contentRange = driveRes.headers.get("Content-Range");
        const headers = {
            ...corsHeaders(),
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable"
        };
        if (contentLength) headers["Content-Length"] = contentLength;
        if (contentRange) headers["Content-Range"] = contentRange;
        return new Response(driveRes.body, {
            status: driveRes.status,
            headers: headers
        });
    }
};

async function putStreamToR2(bucket, key, stream, contentType) {
    const CHUNK_SIZE = 25 * 1024 * 1024;
    const upload = await bucket.createMultipartUpload(key, {
        httpMetadata: {
            contentType: contentType
        }
    });
    const reader = stream.getReader();
    let buffered = [];
    let bufferedBytes = 0;
    let partNumber = 1;
    const parts = [];
    async function flushExact(size) {
        const taken = [];
        let takenBytes = 0;
        while (takenBytes < size && buffered.length) {
            const arr = buffered[0];
            const need = size - takenBytes;
            if (arr.byteLength <= need) {
                taken.push(arr);
                takenBytes += arr.byteLength;
                buffered.shift();
            } else {
                taken.push(arr.subarray(0, need));
                buffered[0] = arr.subarray(need);
                takenBytes += need;
            }
        }
        bufferedBytes -= takenBytes;
        const blob = new Blob(taken);
        const part = await upload.uploadPart(partNumber, blob);
        parts.push(part);
        partNumber++;
    }
    try {
        while (true) {
            const {done: done, value: value} = await reader.read();
            if (done) break;
            buffered.push(value);
            bufferedBytes += value.byteLength;
            while (bufferedBytes >= CHUNK_SIZE) {
                await flushExact(CHUNK_SIZE);
            }
        }
        if (bufferedBytes > 0) {
            await flushExact(bufferedBytes);
        }
        await upload.complete(parts);
    } catch (e) {
        await upload.abort().catch(() => {});
        throw e;
    }
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, X-Admin-Token",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges"
    };
}

function parseRange(rangeHeader) {
    if (!rangeHeader) return undefined;
    const suffixMatch = /^bytes=-(\d+)$/.exec(rangeHeader);
    if (suffixMatch) return {
        suffix: Number(suffixMatch[1])
    };
    const m = /^bytes=(\d+)-(\d+)?$/.exec(rangeHeader);
    if (!m) return undefined;
    const offset = Number(m[1]);
    const end = m[2] !== undefined ? Number(m[2]) : undefined;
    return end !== undefined ? {
        offset: offset,
        length: end - offset + 1
    } : {
        offset: offset
    };
}

function objectToResponse(obj, wasRangeRequest) {
    const headers = new Headers(corsHeaders());
    headers.set("Content-Type", obj.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (wasRangeRequest && obj.range) {
        let start, length;
        if (obj.range.suffix !== undefined) {
            length = obj.range.suffix;
            start = obj.size - length;
        } else {
            start = obj.range.offset ?? 0;
            length = obj.range.length ?? obj.size - start;
        }
        headers.set("Content-Range", `bytes ${start}-${start + length - 1}/${obj.size}`);
        headers.set("Content-Length", String(length));
        return new Response(obj.body, {
            status: 206,
            headers: headers
        });
    }
    headers.set("Content-Length", String(obj.size));
    return new Response(obj.body, {
        status: 200,
        headers: headers
    });
}

function driveMediaUrl(fileId, env) {
    return `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${encodeURIComponent(env.DRIVE_API_KEY)}`;
}

async function handleDriveList(url, env) {
    const json = (status, obj) => new Response(JSON.stringify(obj), {
        status: status,
        headers: {
            ...corsHeaders(),
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
    if (!env.DRIVE_API_KEY) return json(500, {
        error: "DRIVE_API_KEY não configurada no Worker."
    });
    const q = url.searchParams.get("q") || "";
    const pageToken = url.searchParams.get("pageToken");
    if (q.length > 300 || !(PARENT_Q_RE.test(q) || NAME_Q_RE.test(q))) {
        return json(400, {
            error: "Consulta não permitida."
        });
    }
    if (pageToken && pageToken.length > 2e3) {
        return json(400, {
            error: "pageToken inválido."
        });
    }
    const params = new URLSearchParams({
        q: q,
        fields: "nextPageToken, files(id,name,mimeType,size,modifiedTime,shortcutDetails,thumbnailLink)",
        pageSize: "1000",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true",
        key: env.DRIVE_API_KEY
    });
    if (pageToken) params.set("pageToken", pageToken);
    try {
        const res = await fetchUpstreamWithRetry(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {}, {
            attempts: 3,
            timeoutMs: 12e3
        });
        const responseBody = await res.text();
        if (res.status === 403) {
            let detail = { status: null, code: null, reasons: [], message: "" };
            try {
                const payload = JSON.parse(responseBody);
                const error = payload && payload.error ? payload.error : payload;
                detail.status = error.status || null;
                detail.code = error.code || null;
                detail.reasons = Array.isArray(error.errors) ? [...new Set(error.errors.map(item => item && item.reason).filter(Boolean))] : [];
                detail.message = String(error.message || "").slice(0, 300);
            } catch (_) {
                detail.message = String(responseBody).slice(0, 200);
            }
            console.error("[PlanetaHQ] Drive list upstream 403", JSON.stringify(detail));
        }
        return new Response(responseBody, {
            status: res.status,
            headers: {
                ...corsHeaders(),
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            }
        });
    } catch (e) {
        return json(502, {
            error: String(e)
        });
    }
}

function safeEqual(a, b) {
    const enc = new TextEncoder;
    const x = enc.encode(String(a));
    const y = enc.encode(String(b));
    let diff = x.length ^ y.length;
    const n = Math.max(x.length, y.length);
    for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
    return diff === 0;
}

function normalizeCode(raw) {
    return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function formatCode(raw) {
    return raw.slice(0, 4) + "-" + raw.slice(4, 8);
}

function generateCode() {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < 8; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    return out;
}

async function requireAccessCode(url, env) {
    const code = normalizeCode(url.searchParams.get("code") || "");
    const deviceId = (url.searchParams.get("device") || "").slice(0, 100);
    const deviceType = (url.searchParams.get("type") || "").slice(0, 20);
    const result = await checkAndRegisterDevice(code, deviceId, deviceType, env);
    if (!result.valid) {
        return new Response(JSON.stringify({
            error: result.reason || "Código de acesso inválido."
        }), {
            status: 401,
            headers: {
                ...corsHeaders(),
                "Content-Type": "application/json"
            }
        });
    }
    return null;
}

async function checkAndRegisterDevice(code, deviceId, deviceType, env, options = {}) {
    if (!code) return {
        valid: false,
        reason: "Faltou o código de acesso."
    };
    if (!deviceId) return {
        valid: false,
        reason: "Aparelho não identificado."
    };
    const key = `access:${code}`;
    const raw = await env.ACCESS_CODES.get(key);
    if (!raw) return {
        valid: false,
        reason: "Código de acesso inválido."
    };
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        data = {};
    }
    let devices = Array.isArray(data.devices) ? data.devices : [];
    devices = devices.map(d => typeof d === "string" ? {
        id: d,
        lastUsed: 0,
        type: ""
    } : d);
    const now = Date.now();
    const existing = devices.find(d => d.id === deviceId);
    if (existing) {
        if (options.touchLastUsed === true) {
            const lastUsed = Number(existing.lastUsed) || 0;
            const typeChanged = !!deviceType && existing.type !== deviceType;
            if (now - lastUsed >= DEVICE_LAST_USED_WRITE_INTERVAL_MS || typeChanged) {
                existing.lastUsed = now;
                if (deviceType) existing.type = deviceType;
                data.devices = devices;
                try {
                    await env.ACCESS_CODES.put(key, JSON.stringify(data));
                } catch (e) {
                    console.warn("[PlanetaHQ Worker] lastUsed KV touch skipped:", String(e?.message || e));
                }
            }
        }
        return {
            valid: true
        };
    }
    if (devices.length >= MAX_DEVICES_PER_CODE) {
        devices.sort((a, b) => a.lastUsed - b.lastUsed);
        devices.shift();
    }
    devices.push({
        id: deviceId,
        lastUsed: now,
        type: deviceType || ""
    });
    data.devices = devices;
    await env.ACCESS_CODES.put(key, JSON.stringify(data));
    return {
        valid: true
    };
}

async function listDevices(code, env) {
    if (!code) return null;
    const key = `access:${code}`;
    const raw = await env.ACCESS_CODES.get(key);
    if (!raw) return null;
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        data = {};
    }
    const devices = Array.isArray(data.devices) ? data.devices : [];
    return devices.map(d => typeof d === "string" ? {
        id: d,
        lastUsed: 0,
        type: ""
    } : d).sort((a, b) => b.lastUsed - a.lastUsed);
}

async function removeDevice(code, removeId, env) {
    if (!code) return false;
    const key = `access:${code}`;
    const raw = await env.ACCESS_CODES.get(key);
    if (!raw) return false;
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        data = {};
    }
    const devices = Array.isArray(data.devices) ? data.devices : [];
    data.devices = devices.map(d => typeof d === "string" ? {
        id: d,
        lastUsed: 0
    } : d).filter(d => d.id !== removeId);
    await env.ACCESS_CODES.put(key, JSON.stringify(data));
    return true;
}

function deepFindString(obj, test, seen = new Set) {
    if (obj == null || typeof obj !== "object" || seen.has(obj)) return null;
    seen.add(obj);
    for (const value of Object.values(obj)) {
        if (typeof value === "string" && test(value)) return value;
    }
    for (const value of Object.values(obj)) {
        if (value && typeof value === "object") {
            const found = deepFindString(value, test, seen);
            if (found) return found;
        }
    }
    return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeToken(v) {
    return String(v).toLowerCase().replace(/[^a-z0-9]/g, "");
}

const PAID_MARKER_RE = /paid|approved|pago|aprovado/;

const NOT_PAID_MARKER_RE = /refund|reembols|fail|falh|expired|expirad|pending|pendente|generated|gerado|abandon|cancel|pastdue|quiz|leadcaptured/;

const BUYER_PATH_RE = /customer|buyer|client|cliente|comprador|payer|lead|user/i;

const SELLER_PATH_RE = /seller|vendor|producer|produtor|vendedor|owner|affiliate|afiliado|merchant|store|loja/i;

function collectStrings(obj, path = "", out = [], seen = new Set) {
    if (obj == null || typeof obj !== "object" || seen.has(obj)) return out;
    seen.add(obj);
    for (const [k, v] of Object.entries(obj)) {
        const p = path ? `${path}.${k}` : k;
        if (typeof v === "string") out.push({
            path: p,
            value: v
        }); else if (v && typeof v === "object") collectStrings(v, p, out, seen);
    }
    return out;
}

function pickBuyerEmail(strings, env) {
    const own = String(env.SENDER_EMAIL || "").trim().toLowerCase();
    const all = strings.filter(s => EMAIL_RE.test(s.value.trim())).map(s => ({
        path: s.path,
        email: s.value.trim().toLowerCase()
    })).filter(c => c.email !== own);
    const notSeller = all.filter(c => !SELLER_PATH_RE.test(c.path));
    const pool = notSeller.length ? notSeller : [];
    const buyer = pool.find(c => BUYER_PATH_RE.test(c.path));
    return {
        chosen: buyer || pool[0] || null,
        candidatePaths: all.map(c => c.path)
    };
}

async function handleGgWebhook(request, env) {
    const rawBody = await request.text();
    if (env.GG_WEBHOOK_SECRET) {
        const given = request.headers.get("X-Secret") || "";
        if (!given || !safeEqual(given, env.GG_WEBHOOK_SECRET)) {
            return new Response("Assinatura inválida.", {
                status: 401,
                headers: corsHeaders()
            });
        }
    }
    let payload;
    try {
        payload = JSON.parse(rawBody);
    } catch (e) {
        return new Response("JSON inválido.", {
            status: 400,
            headers: corsHeaders()
        });
    }
    const strings = collectStrings(payload);
    const shorts = strings.filter(s => s.value.length <= 40);
    const paidHits = shorts.filter(s => PAID_MARKER_RE.test(normalizeToken(s.value)));
    const notPaidHits = shorts.filter(s => NOT_PAID_MARKER_RE.test(normalizeToken(s.value)));
    const {chosen: chosen, candidatePaths: candidatePaths} = pickBuyerEmail(strings, env);
    console.log("[gg-webhook] recebido", JSON.stringify({
        camposDoTopo: Object.keys(payload || {}),
        marcadoresPago: paidHits.slice(0, 6).map(s => `${s.path}=${s.value}`),
        marcadoresNaoPago: notPaidHits.slice(0, 6).map(s => `${s.path}=${s.value}`),
        caminhosDeEmail: candidatePaths,
        emailEscolhidoEm: chosen ? chosen.path : null
    }));
    if (paidHits.length === 0 && notPaidHits.length > 0) {
        return new Response(JSON.stringify({
            ignored: true
        }), {
            headers: {
                ...corsHeaders(),
                "Content-Type": "application/json"
            }
        });
    }
    if (!chosen) {
        console.log("[gg-webhook] nenhum e-mail de comprador encontrado no payload");
        return new Response(JSON.stringify({
            error: "Não achei o e-mail do comprador no payload."
        }), {
            status: 422,
            headers: {
                ...corsHeaders(),
                "Content-Type": "application/json"
            }
        });
    }
    const normalizedEmail = chosen.email;
    const emailKey = `email:${normalizedEmail}`;
    let code = await env.ACCESS_CODES.get(emailKey);
    if (!code) {
        code = generateCode();
        await env.ACCESS_CODES.put(`access:${code}`, JSON.stringify({
            email: normalizedEmail,
            createdAt: Date.now(),
            devices: []
        }));
        await env.ACCESS_CODES.put(emailKey, code);
    }
    if (!env.BREVO_API_KEY) {
        console.log("[gg-webhook] código criado, mas BREVO_API_KEY não está configurada: e-mail NÃO enviado");
    } else {
        try {
            await sendAccessCodeEmail(env, normalizedEmail, formatCode(code));
        } catch (e) {
            console.log("[gg-webhook] falha ao enviar e-mail pelo Brevo:", String(e));
            return new Response(JSON.stringify({
                granted: true,
                emailed: false,
                error: String(e)
            }), {
                status: 502,
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
    }
    return new Response(JSON.stringify({
        granted: true,
        emailed: !!env.BREVO_API_KEY
    }), {
        headers: {
            ...corsHeaders(),
            "Content-Type": "application/json"
        }
    });
}

async function sendAccessCodeEmail(env, toEmail, formattedCode) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": env.BREVO_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: "Planeta HQ",
                email: env.SENDER_EMAIL || "contato@planetahq.app"
            },
            to: [ {
                email: toEmail
            } ],
            subject: "Seu código de acesso ao Planeta HQ",
            htmlContent: `\n        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">\n          <h2>Bem-vindo(a) ao Planeta HQ! 🚀</h2>\n          <p>Sua compra foi confirmada. Use o código abaixo para entrar no app:</p>\n          <p style="font-size:28px;font-weight:bold;letter-spacing:2px;background:#f2f2f2;padding:16px;border-radius:8px;text-align:center;">${formattedCode}</p>\n          <p>Guarde este e-mail — você vai precisar do código sempre que instalar o app em um novo aparelho.</p>\n        </div>`
        })
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Brevo respondeu ${res.status}: ${text}`);
    }
}