const ID_RE = /^[A-Za-z0-9_-]{10,100}$/;

const PARENT_Q_RE = /^'[A-Za-z0-9_-]{10,100}' in parents and trashed = false$/;

const NAME_Q_RE = /^name contains '(?:[^'\\]|\\.)*' and trashed = false$/;

const ADMIN_MODES = [ "list_cache", "purge_logos", "forget", "warm", "grant", "revoke_access", "revoke_code" ];

const MAX_COVER_BYTES = 3 * 1024 * 1024;
const MAX_CATALOG_BYTES = 25 * 1024 * 1024;
const R2_CATALOG_KEY = "catalog/index.json";
const R2_CATALOG_MODE_KEY = "catalog/mode.json";
const R2_CATALOG_UPDATE_PREFIX = "catalog/updates/";
const R2_CATALOG_ROOT_ID = "11JGPcNE-t4R4G8NaefyATXW3cWeu2n8Y";
const R2_DEMOLIDOR_FOLDER_ID = "18tH5RkW0MWvtqiCaJSQcIG9sb7gfq736";
const R2_SAGA_XMEN_FOLDER_ID = "1jiBlGGjBlejTOeNjZ8CvMGrDnsqS1Myx";
const R2_SAGA_XMEN_ITEMS = [
    { id: "10ey57BLxTm84LB-uoS3T0xQb8ZEW_NAf", name: "A Saga dos X-Men - Volume 01.cbr" },
    { id: "1a_bFx3S-8EQppRtkBs1kXvmkYdmHbwZJ", name: "A Saga dos X-Men - Volume 02.cbr" },
    { id: "1onWLbKEL80zDKMZTLQbfKC13lysDNQfL", name: "A Saga dos X-Men - Volume 03.cbr" },
    { id: "1DitL6mpLRvYV1eSQJMAM5uSq8VfJ4kib", name: "A Saga dos X-Men - Volume 04.cbr" },
    { id: "1stBpGLBCTbwfvhOmR2DV3NWgblPnkfLh", name: "A Saga dos X-Men - Volume 05.cbr" },
    { id: "179X5fzCsbZG33HuMfU8ocoUoWnghV6dy", name: "A Saga dos X-Men - Volume 06.cbr" },
    { id: "1SsMTBXcRMsmrRa7Ozw1spWmHQiiZNxYy", name: "A Saga dos X-Men - Volume 07.cbr" },
    { id: "1RIAT5cNpRgwCrLafpk39Oo25hcHeIDv4", name: "A Saga dos X-Men - Volume 08.cbr" },
    { id: "1yZaXtDpAZorKhx4ywOt7PkBoXtX5kOTu", name: "A Saga dos X-Men - Volume 09.cbr" },
    { id: "1eor0kLLnEOhElfnkP-RLHmaY-bGGsTU6", name: "A Saga dos X-Men - Volume 10.cbr" },
    { id: "1y3vJCqAnav4DmFQoZiKjN0tlxUWgSOgx", name: "A Saga dos X-Men - Volume 11.cbr" },
    { id: "1OR_ZKDc1fsXe2kXv_L2FiZHScN5AC_JE", name: "A Saga dos X-Men - Volume 12.cbr" },
    { id: "1KmMd2EcYuUy0_77b0jo0KOWr9NTCnUWa", name: "A Saga dos X-Men - Volume 13.cbr" },
    { id: "1K7oJRAV49n_I1nwtD9YRVkuKAdtwlF3w", name: "A Saga dos X-Men - Volume 14.cbr" },
    { id: "1yS8j64OGdB7IAWHt5v41OF3yGB9_kztZ", name: "A Saga dos X-Men - Volume 15.cbr" },
    { id: "1smSbhPNGA9VrYyImrqQHhzbyEzlxT0-9", name: "A Saga dos X-Men - Volume 16.cbr" },
    { id: "1Xi7YGZ9xD8SGqJ-gBqdBZrTJJgvrGK_x", name: "A Saga dos X-Men - Volume 17.cbr" },
    { id: "1vb8gXQZVME2FSYqTdQl0WiHNR8G5zKXe", name: "A Saga dos X-Men - Volume 18.cbr" },
    { id: "1I8Jc368vkyAq9X_ytx8yGjwWxA7R1w0L", name: "A Saga dos X-Men - Volume 19.cbr" },
    { id: "1PlJBbANrjhw6-5kIbgtzSO3BQVxVQzdr", name: "A Saga dos X-Men - Volume 20.cbr" },
    { id: "11lTKW5pPyRdV5xUxXoVZElVpDo1fSwAK", name: "A Saga dos X-Men - Volume 21.cbr" },
    { id: "1abKCrgsnthKZA0DffWGme22Upmwxkyy3", name: "A Saga dos X-Men - Volume 22.cbr" },
    { id: "1F7AiZ3ZQl0dQnqD-bMdr-Y0kw0ih1P1o", name: "A Saga dos X-Men - Volume 23.cbr" },
    { id: "1sUL7qINSUHp4RGnS6v8WO_5RFZOf-AeP", name: "A Saga dos X-Men - Volume 24.cbr" },
    { id: "1TEXaGs1bgSqZZr8yrraugnuq2ShVsiCH", name: "A Saga dos X-Men - Volume 25.cbr" },
    { id: "1RubE6btbLa5H9GMKtzHVUCOQ_V7403BV", name: "A Saga dos X-Men - Volume 26.cbr" },
    { id: "1NG54k58l1yQ6Xq8fYGVuzZxGntfIXZ1g", name: "A Saga dos X-Men - Volume 27.cbr" },
    { id: "1CK48vIV7jraqa6E2KbXe9G7CXblnPeuW", name: "A Saga dos X-Men - Volume 28.cbr" },
    { id: "1m8f2cFW3nAa73ixjLasev_IGrr80wSSn", name: "A Saga dos X-Men - Volume 29.cbr" },
    { id: "1XMaLLiUixgxsOWhlBqP7Jz0Js1OsK2sp", name: "A Saga dos X-Men - Volume 30.cbr" },
    { id: "14wc9oi-vU2Q6w-jcN4M_x0PoGIxmtXYS", name: "A Saga dos X-Men - Volume 31.cbr" },
    { id: "1dJZyzrdM_W_PLrqZDVy_NmqOKuqtCvys", name: "A Saga dos X-Men - Volume 32.cbr" },
    { id: "1vh_U86hDHOl3dVRkdIkTGqEb8dvSjl_h", name: "A Saga dos X-Men - Volume 33.cbr" },
    { id: "1hawLaVt2wqUEaqJX374XbEeIOwL4GBfQ", name: "A Saga dos X-Men - Volume 34.cbr" },
    { id: "1OmPcCRhBjnNOxosHAUtW6RMOzKRyZRXG", name: "A Saga dos X-Men - Volume 35.cbz" },
    { id: "1Go7Yvi7EG7nc6GjprSk-v5zDLq67WzA5", name: "A Saga dos X-Men - Volume 36 (FIM DE FASE).cbz" }
];
const R2_CATALOG_CACHE_TTL_MS = 30000;
const R2_CATALOG_UPDATE_MEMO_TTL_MS = 30000;
const R2_CATALOG_UPDATE_MEMO_MAX_ENTRIES = 128;
let r2CatalogMemo = { expiresAt: 0, value: null, loaded: false };
let r2OnlyMemo = { expiresAt: 0, value: false, loaded: false };
const r2CatalogUpdateListMemo = new Map();
const r2CatalogUpdateFingerprintMemo = new Map();
const driveMetadataMemo = new Map();
const SHARED_RECENT_ADDED_PREFIX = "shared:recent-added:comic:";
const SHARED_RECENT_ADDED_MAX_IDS = 50000;
const SHARED_RECENT_ADDED_MAX_BODY_BYTES = 5 * 1024 * 1024;
const SHARED_RECENT_ADDED_MEMO_TTL_MS = 15000;
let sharedRecentAddedMemo = { expiresAt: 0, ids: null };
let sharedRecentAddedMutationQueue = Promise.resolve();
let driveAccessTokenMemo = { credentialId: "", accessToken: "", expiresAt: 0 };
let driveAccessTokenInflight = null;
let driveSigningKeyMemo = { credentialId: "", key: null };

const GOOGLE_SERVICE_ACCOUNT_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_DRIVE_READONLY_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const GOOGLE_JWT_BEARER_GRANT = "urn:ietf:params:oauth:grant-type:jwt-bearer";

// DRIVE_SERVICE_ACCOUNT_JSON is a Cloudflare secret containing the service-account
// JSON key. When configured, OAuth is preferred; DRIVE_API_KEY remains a public-file fallback.
function hasDriveAccessCredentials(env) {
    return !!(String(env.DRIVE_SERVICE_ACCOUNT_JSON || "").trim() || String(env.DRIVE_API_KEY || "").trim());
}

function base64UrlEncodeBytes(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function getDriveServiceAccountCredentials(env) {
    const raw = String(env.DRIVE_SERVICE_ACCOUNT_JSON || "").trim();
    if (!raw) return null;
    let credentials;
    try { credentials = JSON.parse(raw); }
    catch (_) { throw new Error("DRIVE_SERVICE_ACCOUNT_JSON precisa conter o JSON da conta de serviço do Google."); }
    const email = String(credentials.client_email || "").trim();
    const privateKey = String(credentials.private_key || "").replace(/\\n/g, "\n").trim();
    if (!/^[^\s@]+@[^\s@]+\.iam\.gserviceaccount\.com$/.test(email) || !privateKey.includes("BEGIN PRIVATE KEY")) {
        throw new Error("DRIVE_SERVICE_ACCOUNT_JSON não contém client_email/private_key válidos.");
    }
    const credentialId = `${email}:${String(credentials.private_key_id || "")}`;
    return { email, privateKey, credentialId };
}

async function getDriveAccessToken(env) {
    const credentials = getDriveServiceAccountCredentials(env);
    if (!credentials) return null;
    const now = Date.now();
    if (driveAccessTokenMemo.credentialId === credentials.credentialId && now < driveAccessTokenMemo.expiresAt) {
        return driveAccessTokenMemo.accessToken;
    }
    if (driveAccessTokenInflight?.credentialId === credentials.credentialId) return driveAccessTokenInflight.promise;
    const promise = (async () => {
        let signingKey = driveSigningKeyMemo.credentialId === credentials.credentialId ? driveSigningKeyMemo.key : null;
        if (!signingKey) {
            const pem = credentials.privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s+/g, "");
            let der;
            try { der = Uint8Array.from(atob(pem), char => char.charCodeAt(0)); }
            catch (_) { throw new Error("A chave privada da conta de serviço não está em formato PEM válido."); }
            try {
                signingKey = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
            } catch (_) { throw new Error("Não foi possível importar a chave privada da conta de serviço."); }
            driveSigningKeyMemo = { credentialId: credentials.credentialId, key: signingKey };
        }
        const issuedAt = Math.floor(Date.now() / 1000);
        const header = base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
        const claims = base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify({
            iss: credentials.email,
            scope: GOOGLE_DRIVE_READONLY_SCOPE,
            aud: GOOGLE_SERVICE_ACCOUNT_TOKEN_URL,
            iat: issuedAt,
            exp: issuedAt + 3600
        })));
        const unsignedAssertion = `${header}.${claims}`;
        const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", signingKey, new TextEncoder().encode(unsignedAssertion));
        const assertion = `${unsignedAssertion}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
        const tokenResponse = await fetchUpstreamWithRetry(GOOGLE_SERVICE_ACCOUNT_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ grant_type: GOOGLE_JWT_BEARER_GRANT, assertion }).toString()
        }, { attempts: 3, timeoutMs: 12000 });
        let tokenData = {};
        try { tokenData = await tokenResponse.json(); } catch (_) {}
        if (!tokenResponse.ok || !tokenData.access_token) {
            const detail = String(tokenData.error_description || tokenData.error || `HTTP ${tokenResponse.status}`).slice(0, 180);
            throw new Error(`Google OAuth não autorizou a conta de serviço (${detail}).`);
        }
        const lifetime = Math.max(60, Number(tokenData.expires_in) || 3600);
        driveAccessTokenMemo = {
            credentialId: credentials.credentialId,
            accessToken: String(tokenData.access_token),
            expiresAt: Date.now() + Math.max(30000, (lifetime - 120) * 1000)
        };
        return driveAccessTokenMemo.accessToken;
    })();
    driveAccessTokenInflight = { credentialId: credentials.credentialId, promise };
    try { return await promise; }
    finally { if (driveAccessTokenInflight?.promise === promise) driveAccessTokenInflight = null; }
}

async function driveAuthHeaders(env) {
    const token = await getDriveAccessToken(env);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function addDriveApiKeyIfNeeded(params, env) {
    if (!String(env.DRIVE_SERVICE_ACCOUNT_JSON || "").trim() && env.DRIVE_API_KEY) params.set("key", env.DRIVE_API_KEY);
}

const COVER_TYPES = [ "image/jpeg", "image/png", "image/webp" ];

const DRIVE_THUMBNAIL_HOSTS = [
    "googleusercontent.com",
    "google.com",
    "googleapis.com",
    "gstatic.com"
];

function isAllowedDriveThumbnailUrl(value) {
    try {
        const parsed = new URL(String(value || ""));
        if (parsed.protocol !== "https:") return false;
        const hostname = parsed.hostname.toLowerCase();
        return DRIVE_THUMBNAIL_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`));
    } catch (_) {
        return false;
    }
}

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

const MEDIA_CHUNK_BYTES = 8 * 1024 * 1024;
const MEDIA_MAX_BUFFER_BYTES = 16 * 1024 * 1024;

function parseContentRangeHeader(value) {
    const match = /^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i.exec(value || "");
    if (!match || match[3] === "*") return null;
    return { start: Number(match[1]), end: Number(match[2]), total: Number(match[3]) };
}

function concatChunks(chunks, total) {
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.byteLength; }
    return out;
}

async function readBodyLimited(response, maxBytes) {
    if (!response.body) return { bytes: new Uint8Array(0), response };
    const declared = Number(response.headers.get("Content-Length"));
    if (Number.isFinite(declared) && declared > maxBytes) return { bytes: null, response };
    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            try { reader.releaseLock(); } catch (_) {}
            const bytes = concatChunks(chunks, total);
            const bufferedResponse = new Response(bytes, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
            return { bytes, response: bufferedResponse };
        }
        const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
        if (total + chunk.byteLength > maxBytes) {
            chunks.push(chunk);
            total += chunk.byteLength;
            let first = true;
            const body = new ReadableStream({
                async pull(controller) {
                    if (first) {
                        first = false;
                        for (const part of chunks) controller.enqueue(part);
                        return;
                    }
                    try {
                        const next = await reader.read();
                        if (next.done) { try { reader.releaseLock(); } catch (_) {} controller.close(); }
                        else controller.enqueue(next.value);
                    } catch (error) { controller.error(error); }
                },
                async cancel(reason) { try { await reader.cancel(reason); } catch (_) {} }
            });
            const passthrough = new Response(body, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
            return { bytes: null, response: passthrough };
        }
        chunks.push(chunk);
        total += chunk.byteLength;
    }
}

async function fetchUpstreamBufferedWithRetry(input, init = {}, options = {}) {
    const attempts = options.attempts ?? 4;
    const timeoutMs = options.timeoutMs ?? 25000;
    const maxBufferBytes = options.maxBufferBytes ?? MEDIA_MAX_BUFFER_BYTES;
    const externalSignal = init.signal;
    const host = (() => { try { return new URL(input).hostname; } catch (_) { return "upstream"; } })();
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        const controller = new AbortController();
        const onExternalAbort = () => controller.abort();
        if (externalSignal) {
            if (externalSignal.aborted) controller.abort();
            else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
        }
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(input, { ...init, signal: controller.signal });
            let retry = UPSTREAM_RETRY_STATUSES.has(response.status);
            if (response.status === 403) {
                const body = await response.clone().text().catch(() => "");
                retry = /rateLimitExceeded|userRateLimitExceeded|quotaExceeded/i.test(body);
            }
            if (retry && attempt < attempts) {
                try { await response.body?.cancel(); } catch (_) {}
                clearTimeout(timer);
                if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
                await sleepMs(upstreamRetryDelay(response, attempt));
                continue;
            }
            if (!(response.ok || response.status === 206)) {
                clearTimeout(timer);
                if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
                return { response, bytes: null };
            }
            const bodyResult = await readBodyLimited(response, maxBufferBytes);
            clearTimeout(timer);
            if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
            return bodyResult;
        } catch (error) {
            lastError = error;
            clearTimeout(timer);
            if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
            if (externalSignal?.aborted || attempt >= attempts) throw error;
            console.warn("[PlanetaHQ Worker] upstream body/network retry", host, attempt, String(error?.message || error));
            await sleepMs(upstreamRetryDelay(null, attempt));
        }
    }
    throw lastError || new Error("Upstream indisponível após novas tentativas.");
}

function mediaResponseHeaders(contentType, contentLength, contentRange) {
    const headers = new Headers(corsHeaders());
    headers.set("Content-Type", contentType || "application/octet-stream");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (contentLength != null) headers.set("Content-Length", String(contentLength));
    if (contentRange) headers.set("Content-Range", contentRange);
    return headers;
}

function createResilientFullMediaStream(firstBytes, firstRange, totalSize, driveUrl, contentType, requestHeaders, signal) {
    let offset = firstRange.end + 1;
    let sendFirst = true;
    return new ReadableStream({
        async pull(controller) {
            if (sendFirst) {
                sendFirst = false;
                controller.enqueue(firstBytes);
                return;
            }
            if (offset >= totalSize) { controller.close(); return; }
            const start = offset;
            const end = Math.min(totalSize - 1, start + MEDIA_CHUNK_BYTES - 1);
            try {
                const result = await fetchUpstreamBufferedWithRetry(driveUrl, {
                    headers: { ...requestHeaders, Range: `bytes=${start}-${end}` },
                    signal
                }, { attempts: 5, timeoutMs: 90000, maxBufferBytes: MEDIA_MAX_BUFFER_BYTES });
                if (!result.bytes || result.response.status !== 206) {
                    try { await result.response?.body?.cancel(); } catch (_) {}
                    throw new Error(`Google Drive não entregou o bloco ${start}-${end} como HTTP 206.`);
                }
                const actual = parseContentRangeHeader(result.response.headers.get("Content-Range"));
                if (!actual || actual.start !== start || actual.total !== totalSize || actual.end < start || actual.end > end || result.bytes.byteLength !== actual.end - actual.start + 1) {
                    throw new Error(`Bloco incompleto ou Content-Range inválido em ${start}-${end}.`);
                }
                offset = actual.end + 1;
                controller.enqueue(result.bytes);
            } catch (error) {
                console.error("[PlanetaHQ Worker] mídia: bloco falhou após retries", JSON.stringify({ range: `${start}-${end}`, message: String(error?.message || error).slice(0, 220) }));
                controller.error(error);
            }
        }
    });
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

        if (url.pathname === "/admin/catalog") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogUpload(request, env);
        }
        if (url.pathname === "/admin/catalog-mode") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogMode(request, env);
        }
        if (url.pathname === "/admin/catalog-coverage") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogCoverage(env);
        }
        if (url.pathname === "/admin/catalog-reindex") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogReindex(request, env);
        }
        if (url.pathname === "/admin/catalog-repair-r2") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogRepairR2(request, env);
        }
        if (url.pathname === "/admin/search") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCatalogSearch(url, env);
        }
        if (url.pathname === "/admin/cover-image") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            const id = url.searchParams.get("id") || "";
            if (!ID_RE.test(id)) return new Response("ID inválido.", { status: 400, headers: corsHeaders() });
            const obj = await env.COMIC_CACHE.get(`detail-cover/${id}`);
            if (!obj) return new Response("Capa personalizada não encontrada.", { status: 404, headers: corsHeaders() });
            const headers = new Headers(corsHeaders());
            headers.set("Content-Type", obj.httpMetadata?.contentType || "image/jpeg");
            headers.set("Cache-Control", "no-store");
            return new Response(obj.body, { headers });
        }
        if (url.pathname === "/admin/metadata") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminMetadata(request, url, env);
        }
        if (url.pathname === "/admin/cover") {
            const denied = requireAdminToken(request, env);
            if (denied) return denied;
            return handleAdminCover(request, url, env);
        }
        if (url.searchParams.get("detail_metadata") === "1") {
            return handlePublicDetailMetadata(env, url);
        }
        if (url.searchParams.get("recent_added") === "1") {
            if (request.method !== "GET" && request.method !== "POST") {
                return new Response(JSON.stringify({ error: "Use GET ou POST para acessar Adicionados Recentemente." }), {
                    status: 405,
                    headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                });
            }
            const denied = await requireAccessCode(url, env);
            if (denied) return denied;
            return handleSharedRecentAdded(request, env);
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
        if (url.searchParams.get("revoke_access") === "1") {
            if (request.method !== "GET" && request.method !== "POST") {
                return new Response(JSON.stringify({ error: "Use GET ou POST para revogar acesso." }), {
                    status: 405,
                    headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                });
            }
            let email = url.searchParams.get("email") || "";
            if (request.method === "POST") {
                try {
                    const body = await request.json();
                    email = typeof body?.email === "string" ? body.email : email;
                } catch (_) {}
            }
            const result = await revokeAccessByEmail(email, env);
            return new Response(JSON.stringify(result), {
                status: result.ok ? 200 : 400,
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            });
        }
        if (url.searchParams.get("revoke_code") === "1") {
            let body = {};
            if (request.method === "POST") {
                try { body = await request.json(); } catch (_) {}
            }
            const result = await revokeAccessByCode(body.code || url.searchParams.get("code") || "", env);
            return new Response(JSON.stringify(result), {
                status: result.ok ? 200 : 400,
                headers: {
                    ...corsHeaders(),
                    "Content-Type": "application/json"
                }
            });
        }
        if (url.searchParams.get("drive_list") === "1") {
            const denied = await requireAccessCode(url, env);
            if (denied) return denied;
            return handleDriveList(url, env, ctx);
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
        if (url.searchParams.get("detail_cover") === "1") {
            try {
                const obj = await env.COMIC_CACHE.get(`detail-cover/${fileId}`);
                if (!obj) return new Response("Capa personalizada não encontrada.", { status: 404, headers: corsHeaders() });
                const headers = new Headers(corsHeaders());
                headers.set("Content-Type", obj.httpMetadata?.contentType || "image/jpeg");
                headers.set("Cache-Control", "no-store");
                return new Response(obj.body, { headers });
            } catch (e) { return new Response("Falha ao buscar a capa.", { status: 500, headers: corsHeaders() }); }
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
            if (declared > MAX_COVER_BYTES) {
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
        // Importação administrativa explícita: o aquecedor privado, validado
        // por ADMIN_TOKEN acima, ainda pode copiar Drive -> R2 em modo r2-only.
        // As requisições normais do app não passam por este ramo e continuam
        // sem fallback ao Drive quando r2-only está ativo.
        if (url.searchParams.get("warm") === "1") {
            if (!hasDriveAccessCredentials(env)) {
                return new Response("Configure DRIVE_SERVICE_ACCOUNT_JSON ou DRIVE_API_KEY no Worker.", { status: 500, headers: corsHeaders() });
            }
            try {
                const requestedItem = await getDriveMetadataForCatalog(fileId, env);
                let mediaItem = requestedItem;
                const metadataItems = [requestedItem];
                if (requestedItem.mimeType === "application/vnd.google-apps.shortcut") {
                    const targetId = requestedItem.shortcutDetails?.targetId;
                    if (!targetId) throw new Error("O atalho não informa targetId.");
                    mediaItem = await getDriveMetadataForCatalog(targetId, env);
                    metadataItems.push(mediaItem);
                }
                // A listagem do Drive frequentemente já traz uma thumbnailLink
                // válida para o arquivo/atalho, mesmo quando files.get() não a
                // devolve novamente. O aquecedor pode encaminhá-la, mas só
                // aceitamos hosts oficiais do Google para evitar que a rota
                // administrativa vire um proxy aberto.
                const suppliedThumbnailLink = url.searchParams.get("thumbnailLink");
                if (suppliedThumbnailLink && isAllowedDriveThumbnailUrl(suppliedThumbnailLink)) {
                    mediaItem = { ...mediaItem, thumbnailLink: suppliedThumbnailLink };
                }
                const isFolder = requestedItem.mimeType === "application/vnd.google-apps.folder" || mediaItem.mimeType === "application/vnd.google-apps.folder";
                const metadataState = await collectCatalogMetadata(env, metadataItems);
                if (isFolder) {
                    const indexedRecords = await persistCatalogMetadataUpdates(env, metadataState);
                    return new Response(JSON.stringify({ cached: false, indexed: true, isFolder: true, id: requestedItem.id, indexedRecords }), {
                        headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                    });
                }
                const mediaId = mediaItem.id;
                if (!ID_RE.test(String(mediaId || ""))) throw new Error("ID real do arquivo inválido.");
                const warmCacheKey = `drive/${mediaId}`;
                const already = await env.COMIC_CACHE.head(warmCacheKey);
                if (already) {
                    const indexedRecords = await persistCatalogMetadataUpdates(env, metadataState);
                    const coverResult = await cacheDriveThumbnail(env, mediaItem, mediaId);
                    return new Response(JSON.stringify({ cached: true, alreadyCached: true, indexed: true, id: mediaId, indexedRecords, coverCached: !!coverResult.cached, coverError: coverResult.error || undefined }), {
                        headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                    });
                }
                const driveUrl = driveMediaUrl(mediaId, env);
                const driveRes = await fetchUpstreamWithRetry(driveUrl, { headers: await driveAuthHeaders(env) }, { attempts: 3, timeoutMs: 25e3 });
                if (!driveRes.ok) {
                    const bodyText = await driveRes.text().catch(() => "");
                    return new Response(JSON.stringify({ cached: false, indexed: false, error: bodyText || `HTTP ${driveRes.status}` }), {
                        status: driveRes.status,
                        headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                    });
                }
                const contentType = driveRes.headers.get("Content-Type") || "application/octet-stream";
                const coverPromise = cacheDriveThumbnail(env, mediaItem, mediaId);
                await putStreamToR2(env.COMIC_CACHE, warmCacheKey, driveRes.body, contentType);
                const indexedRecords = await persistCatalogMetadataUpdates(env, metadataState);
                const coverResult = await coverPromise;
                return new Response(JSON.stringify({ cached: true, indexed: true, id: mediaId, indexedRecords, coverCached: !!coverResult.cached, coverError: coverResult.error || undefined }), {
                    headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ cached: false, indexed: false, error: String(e?.message || e) }), {
                    status: 502,
                    headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
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
        if (await isR2OnlyMode(env)) {
            return new Response(JSON.stringify({ error: "not_found_in_r2", message: "Este arquivo não está armazenado no R2." }), {
                status: 404,
                headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
            });
        }
        if (!hasDriveAccessCredentials(env)) {
            return new Response("Configure DRIVE_SERVICE_ACCOUNT_JSON ou DRIVE_API_KEY no Worker para acessar o Google Drive.", {
                status: 500,
                headers: corsHeaders()
            });
        }
        const driveUrl = driveMediaUrl(fileId, env);
        const driveFetchHeaders = await driveAuthHeaders(env);
        if (rangeHeader) driveFetchHeaders["Range"] = rangeHeader;
        let driveRes;
        let bodyBytes = null;
        try {
            if (rangeHeader) {
                // PDF.js usually requests small byte ranges. Buffer each range
                // before replying so an upstream body reset can be retried
                // without exposing a truncated 206 response to the browser.
                const result = await fetchUpstreamBufferedWithRetry(driveUrl, {
                    headers: driveFetchHeaders,
                    signal: request.signal
                }, { attempts: 5, timeoutMs: 90000, maxBufferBytes: MEDIA_MAX_BUFFER_BYTES });
                driveRes = result.response;
                bodyBytes = result.bytes;
            } else {
                // For complete downloads, fetch and validate one 8 MiB range
                // first, then stream further ranges sequentially. This allows
                // retries on mid-transfer resets without buffering a whole HQ
                // in Worker memory or downloading a PDF before first render.
                const firstEnd = MEDIA_CHUNK_BYTES - 1;
                const result = await fetchUpstreamBufferedWithRetry(driveUrl, {
                    headers: { ...driveFetchHeaders, Range: `bytes=0-${firstEnd}` },
                    signal: request.signal
                }, { attempts: 5, timeoutMs: 90000, maxBufferBytes: MEDIA_MAX_BUFFER_BYTES });
                driveRes = result.response;
                bodyBytes = result.bytes;
                if (driveRes.status === 206 && bodyBytes) {
                    const firstRange = parseContentRangeHeader(driveRes.headers.get("Content-Range"));
                    const contentType = driveRes.headers.get("Content-Type") || "application/octet-stream";
                    if (firstRange && firstRange.start === 0 && firstRange.total > 0 && firstRange.end < firstRange.total && bodyBytes.byteLength === firstRange.end + 1) {
                        const stream = createResilientFullMediaStream(bodyBytes, firstRange, firstRange.total, driveUrl, contentType, driveFetchHeaders, request.signal);
                        return new Response(stream, {
                            status: 200,
                            headers: mediaResponseHeaders(contentType, firstRange.total)
                        });
                    }
                    if (firstRange && firstRange.start === 0 && firstRange.total > 0 && firstRange.end === firstRange.total - 1 && bodyBytes.byteLength === firstRange.total) {
                        return new Response(bodyBytes, {
                            status: 200,
                            headers: mediaResponseHeaders(contentType, firstRange.total)
                        });
                    }
                    return new Response("Google Drive retornou um primeiro bloco inconsistente; tente novamente.", {
                        status: 502,
                        headers: { ...corsHeaders(), "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
                    });
                }
            }
        } catch (e) {
            console.error("[PlanetaHQ Worker] Drive media failed after body retries:", String(e?.message || e));
            return new Response("Falha temporária ao acessar o Google Drive após repetir o bloco. Tente novamente.", {
                status: 502,
                headers: { ...corsHeaders(), "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
            });
        }
        if (rangeHeader && driveRes && driveRes.status !== 206) {
            try { await driveRes.body?.cancel(); } catch (_) {}
            return new Response("O Google Drive não respeitou a faixa de bytes solicitada.", {
                status: 502,
                headers: { ...corsHeaders(), "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
            });
        }
        if (!driveRes || (!driveRes.ok && driveRes.status !== 206)) {
            const bodyText = await driveRes?.text().catch(() => "") || "Falha ao ler resposta do Google Drive.";
            return new Response(bodyText, {
                status: driveRes?.status || 502,
                headers: { ...corsHeaders(), "Content-Type": driveRes?.headers.get("Content-Type") || "text/plain; charset=utf-8", "Cache-Control": "no-store" }
            });
        }
        const contentType = driveRes.headers.get("Content-Type") || "application/octet-stream";
        const contentLength = driveRes.headers.get("Content-Length");
        const contentRange = driveRes.headers.get("Content-Range");
        const headers = mediaResponseHeaders(contentType, contentLength, contentRange);
        const responseBody = bodyBytes || driveRes.body;
        return new Response(responseBody, {
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

function requireAdminToken(request, env) {
    const json = (status, error) => new Response(JSON.stringify({ error }), { status, headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
    if (!env.ADMIN_TOKEN) return json(503, "ADMIN_TOKEN não está configurado como segredo no Worker.");
    const given = request.headers.get("X-Admin-Token") || "";
    if (!given || !safeEqual(given, env.ADMIN_TOKEN)) return json(401, "ADMIN_TOKEN incorreto ou ausente.");
    return null;
}
async function handlePublicDetailMetadata(env, url) {
    try {
        const requestedIds = url ? [...new Set([
            ...url.searchParams.getAll("id"),
            ...(url.searchParams.get("ids") || "").split(",")
        ].map(id => String(id || "").trim()).filter(Boolean))].slice(0, 50) : [];
        const items = {};
        if (requestedIds.length) {
            await Promise.all(requestedIds.filter(id => ID_RE.test(id)).map(async id => {
                const value = await env.ACCESS_CODES.get(`detail-meta:${id}`);
                if (value) { try { items[id] = JSON.parse(value); } catch (_) {} }
            }));
            return new Response(JSON.stringify({ items }), { headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
        }
        let cursor;
        do {
            const listing = await env.ACCESS_CODES.list({ prefix: "detail-meta:", limit: 1000, cursor });
            const records = await Promise.all(listing.keys.map(async key => {
                const id = key.name.slice("detail-meta:".length);
                const value = await env.ACCESS_CODES.get(key.name);
                if (!value) return null;
                try { return [id, JSON.parse(value)]; } catch (_) { return null; }
            }));
            for (const record of records) if (record) items[record[0]] = record[1];
            cursor = listing.list_complete ? undefined : listing.cursor;
        } while (cursor);
        return new Response(JSON.stringify({ items }), { headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
    } catch (_) { return new Response(JSON.stringify({ items: {} }), { headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } }); }
}
async function handleAdminCatalogSearch(url, env) {
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
    const term = String(url.searchParams.get("q") || "").trim();
    if (term.length < 2 || term.length > 120) return json(400, { error: "Digite de 2 a 120 caracteres para pesquisar." });

    const rootId = "11JGPcNE-t4R4G8NaefyATXW3cWeu2n8Y";
    const cursor = String(url.searchParams.get("cursor") || "");
    let scanId = cursor;
    let state;
    if (cursor) {
        if (!/^[0-9a-f-]{36}$/i.test(cursor)) return json(400, { error: "Cursor de busca inválido." });
        const saved = await env.ACCESS_CODES.get(`admin-search:${cursor}`);
        if (!saved) return json(410, { error: "A busca expirou. Inicie a pesquisa novamente." });
        try { state = JSON.parse(saved); } catch (_) { return json(410, { error: "O estado da busca expirou. Inicie novamente." }); }
        if (state.term !== term) return json(400, { error: "O cursor não corresponde a esta pesquisa." });
    } else {
        scanId = crypto.randomUUID();
        state = { term, queue: [{ folderId: rootId, pageToken: "" }], seenFolders: [rootId], matchedIds: [], blockedFolders: 0, scannedRequests: 0, truncated: false };
    }

    const queue = Array.isArray(state.queue) ? state.queue : [];
    const seenFolders = new Set(Array.isArray(state.seenFolders) ? state.seenFolders : [rootId]);
    const matchedIds = new Set(Array.isArray(state.matchedIds) ? state.matchedIds : []);
    const newFiles = [];
    const norm = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    const needle = norm(term);
    const maxRequestsPerCall = 40;
    const batchSize = 5;
    const maxResults = 500;
    const folderMime = "application/vnd.google-apps.folder";
    const comicName = /\.(pdf|cbz|cbr)$/i;
    const shortcutMime = "application/vnd.google-apps.shortcut";
    const comicMimes = new Set(["application/pdf", "application/zip", "application/x-cbz", "application/vnd.comicbook+zip", "application/x-zip-compressed", "application/x-rar-compressed", "application/vnd.rar", "application/x-cbr", "application/vnd.comicbook-rar", "application/x-rar"]);
    let requestsThisCall = 0;

    while (queue.length && requestsThisCall < maxRequestsPerCall && matchedIds.size < maxResults) {
        const batch = queue.splice(0, Math.min(batchSize, maxRequestsPerCall - requestsThisCall));
        requestsThisCall += batch.length;
        state.scannedRequests += batch.length;
        const results = await Promise.all(batch.map(async task => {
            const folderId = String(task.folderId || "");
            const listUrl = new URL("https://admin.local/");
            listUrl.searchParams.set("q", `'${folderId}' in parents and trashed = false`);
            if (task.pageToken) listUrl.searchParams.set("pageToken", task.pageToken);
            // A busca do editor é administrativa e precisa descobrir itens novos
            // no Drive mesmo quando o catálogo do app está em modo R2-only.
            const response = await handleDriveListFromDrive(listUrl, env);
            let payload;
            try { payload = await response.json(); } catch (_) { payload = { error: "Resposta inválida do Google Drive." }; }
            return { folderId, response, payload };
        }));

        for (const result of results) {
            if (!result.response.ok) {
                if (result.folderId === rootId) return json(result.response.status, result.payload);
                state.blockedFolders = (Number(state.blockedFolders) || 0) + 1;
                continue;
            }
            if (result.payload.nextPageToken) queue.push({ folderId: result.folderId, pageToken: result.payload.nextPageToken });
            for (const rawFile of Array.isArray(result.payload.files) ? result.payload.files : []) {
                const shortcut = String(rawFile?.mimeType || "") === shortcutMime ? rawFile.shortcutDetails : null;
                // The app resolves Drive shortcuts before displaying them. Mirror
                // that behavior here, or a new shortcut to a collection/comic is
                // invisible to the admin search and its target folder is never scanned.
                const file = shortcut?.targetId && shortcut?.targetMimeType ? {
                    ...rawFile,
                    id: shortcut.targetId,
                    mimeType: shortcut.targetMimeType,
                    parents: [result.folderId]
                } : rawFile;
                const mime = String(file?.mimeType || "");
                const name = String(file.name || "");
                const isComic = comicName.test(name) || comicMimes.has(mime);
                if ((mime === folderMime || isComic) && norm(name).includes(needle) && file.id && !matchedIds.has(file.id)) {
                    matchedIds.add(file.id);
                    newFiles.push(file);
                    if (matchedIds.size >= maxResults) { state.truncated = true; queue.length = 0; break; }
                }
                if (mime === folderMime && file.id && !seenFolders.has(file.id)) {
                    seenFolders.add(file.id);
                    queue.push({ folderId: file.id, pageToken: "" });
                }
            }
        }
    }

    let indexedRecords = 0;
    let catalogSyncError = "";
    if (newFiles.length) {
        try {
            const catalogCandidates = [];
            for (const item of newFiles) {
                const mime = String(item.mimeType || "");
                const name = String(item.name || "");
                if (mime === folderMime) {
                    catalogCandidates.push(item);
                } else if ((comicName.test(name) || comicMimes.has(mime)) && ID_RE.test(String(item.id || "")) && await env.COMIC_CACHE.head(`drive/${item.id}`)) {
                    // Only publish comic entries in the app catalog when their
                    // media object is already in R2; the admin can still find
                    // and edit uncached Drive items without making them appear
                    // as broken entries in R2-only mode.
                    catalogCandidates.push(item);
                }
            }
            if (catalogCandidates.length) {
                const metadataState = await collectCatalogMetadata(env, catalogCandidates);
                indexedRecords = await persistCatalogMetadataUpdates(env, metadataState);
            }
        } catch (e) {
            catalogSyncError = String(e?.message || e);
            console.warn("[PlanetaHQ] admin search catalog sync failed", catalogSyncError);
        }
    }
    state.queue = queue;
    state.seenFolders = [...seenFolders];
    state.matchedIds = [...matchedIds];
    const hasMore = queue.length > 0 && !state.truncated;
    if (hasMore) {
        await env.ACCESS_CODES.put(`admin-search:${scanId}`, JSON.stringify(state), { expirationTtl: 600 });
    } else if (cursor) {
        await env.ACCESS_CODES.delete(`admin-search:${scanId}`);
    }
    return json(200, {
        files: newFiles,
        cursor: hasMore ? scanId : "",
        partial: !!state.blockedFolders || !!state.truncated,
        blockedFolders: Number(state.blockedFolders) || 0,
        scannedFolders: Number(state.scannedRequests) || 0,
        indexedRecords,
        catalogSyncError: catalogSyncError || undefined,
        truncated: !!state.truncated,
        done: !hasMore
    });
}
async function handleAdminMetadata(request, url, env) {
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
    if (request.method === "GET") return handlePublicDetailMetadata(env);
    if (request.method === "DELETE") {
        const id = url.searchParams.get("id") || "";
        if (!ID_RE.test(id)) return json(400, { error: "ID inválido." });
        await env.ACCESS_CODES.delete(`detail-meta:${id}`);
        await env.COMIC_CACHE.delete(`detail-cover/${id}`);
        return json(200, { deleted: true });
    }
    if (request.method !== "PUT") return json(405, { error: "Método não permitido." });
    let body; try { body = await request.json(); } catch (_) { return json(400, { error: "JSON inválido." }); }
    const id = String(body.id || "");
    if (!ID_RE.test(id) || !body.metadata || typeof body.metadata !== "object" || Array.isArray(body.metadata)) return json(400, { error: "Dados inválidos." });
    const m = body.metadata;
    const clean = { displayTitle: String(m.displayTitle || m.title || "").slice(0, 240), author: String(m.author || "").slice(0, 500), publicationDate: String(m.publicationDate || "").slice(0, 1000), genres: Array.isArray(m.genres) ? m.genres.slice(0, 20).map(x => String(x).slice(0, 60)) : [], synopsis: String(m.synopsis || "").slice(0, 5000) };
    if (m.coverId && ID_RE.test(String(m.coverId))) clean.coverId = String(m.coverId);
    await env.ACCESS_CODES.put(`detail-meta:${id}`, JSON.stringify(clean));
    return json(200, { saved: true, id });
}
async function handleAdminCover(request, url, env) {
    const json = (status, data) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
    if (request.method !== "PUT") return json(405, { error: "Método não permitido." });
    const id = url.searchParams.get("id") || "";
    const type = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    if (!ID_RE.test(id)) return json(400, { error: "ID inválido." });
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return json(415, { error: "Formato de imagem não permitido." });
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (!declared || declared > MAX_COVER_BYTES) return json(413, { error: "A capa deve ter até 3 MB." });
    const bytes = await request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_COVER_BYTES) return json(413, { error: "Tamanho de imagem inválido." });
    await env.COMIC_CACHE.put(`detail-cover/${id}`, bytes, { httpMetadata: { contentType: type } });
    return json(200, { saved: true, id });
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, PUT, POST, DELETE, OPTIONS",
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
    const params = new URLSearchParams({ alt: "media", supportsAllDrives: "true" });
    addDriveApiKeyIfNeeded(params, env);
    return `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?${params.toString()}`;
}

async function cacheDriveThumbnail(env, item, fileId) {
    const key = `cover/${fileId}`;
    try {
        if (await env.COMIC_CACHE.head(key)) return { cached: true, alreadyCached: true };
        const thumbnailUrl = String(item?.thumbnailLink || "");
        if (!thumbnailUrl || !/^https:\/\//i.test(thumbnailUrl)) return { cached: false, error: "O Drive não forneceu miniatura para este arquivo." };
        const response = await fetchUpstreamWithRetry(thumbnailUrl, { headers: await driveAuthHeaders(env) }, { attempts: 2, timeoutMs: 10000 });
        if (!response.ok) return { cached: false, error: `Miniatura indisponível (HTTP ${response.status}).` };
        const type = String(response.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
        if (!COVER_TYPES.includes(type)) return { cached: false, error: `Formato de miniatura não aceito (${type || "desconhecido"}).` };
        const declared = Number(response.headers.get("Content-Length") || 0);
        if (declared > MAX_COVER_BYTES) return { cached: false, error: "A miniatura excede 3 MB." };
        const bytes = await response.arrayBuffer();
        if (!bytes.byteLength || bytes.byteLength > MAX_COVER_BYTES) return { cached: false, error: "Tamanho de miniatura inválido." };
        await env.COMIC_CACHE.put(key, bytes, { httpMetadata: { contentType: type } });
        return { cached: true };
    } catch (e) {
        return { cached: false, error: String(e?.message || e).slice(0, 200) };
    }
}

async function getR2Catalog(env) {
    const now = Date.now();
    if (r2CatalogMemo.loaded && now < r2CatalogMemo.expiresAt) return r2CatalogMemo.value;
    const obj = await env.COMIC_CACHE.get(R2_CATALOG_KEY);
    if (!obj) {
        r2CatalogMemo = { expiresAt: now + 5000, value: null, loaded: true };
        return null;
    }
    let manifest;
    try { manifest = JSON.parse(await obj.text()); }
    catch (e) { throw new Error("O índice catalog/index.json no R2 não é um JSON válido."); }
    if (!manifest || manifest.schemaVersion !== 1 || !Array.isArray(manifest.items) || !manifest.rootId) {
        throw new Error("Formato do índice R2 inválido; esperado schemaVersion 1 e items[].");
    }
    const byId = new Map();
    const byParent = new Map();
    for (const item of manifest.items) {
        if (!item || typeof item.id !== "string" || !item.id || typeof item.name !== "string") continue;
        byId.set(item.id, item);
        for (const parentId of Array.isArray(item.parents) ? item.parents : []) {
            if (!byParent.has(parentId)) byParent.set(parentId, []);
            byParent.get(parentId).push(item);
        }
    }
    const value = { manifest, byId, byParent, allItems: Array.from(byId.values()) };
    r2CatalogMemo = { expiresAt: now + R2_CATALOG_CACHE_TTL_MS, value, loaded: true };
    return value;
}

async function isR2OnlyMode(env) {
    const now = Date.now();
    if (r2OnlyMemo.loaded && now < r2OnlyMemo.expiresAt) return r2OnlyMemo.value;
    let mode = "r2-first";
    try {
        const obj = await env.COMIC_CACHE.get(R2_CATALOG_MODE_KEY);
        if (obj) {
            const data = JSON.parse(await obj.text());
            if (data && data.mode === "r2-only") mode = "r2-only";
        }
    } catch (_) {}
    const value = mode === "r2-only";
    r2OnlyMemo = { expiresAt: now + 5000, value, loaded: true };
    return value;
}

async function getDriveMetadataForCatalog(fileId, env) {
    if (!ID_RE.test(String(fileId || ""))) throw new Error("ID do Drive inválido ao sincronizar o catálogo.");
    if (!hasDriveAccessCredentials(env)) throw new Error("Configure DRIVE_SERVICE_ACCOUNT_JSON ou DRIVE_API_KEY para sincronizar os metadados.");
    const now = Date.now();
    const cached = driveMetadataMemo.get(fileId);
    if (cached && now < cached.expiresAt) return cached.promise;
    const params = new URLSearchParams({
        fields: "id,name,mimeType,size,createdTime,modifiedTime,shortcutDetails,thumbnailLink,parents",
        supportsAllDrives: "true"
    });
    addDriveApiKeyIfNeeded(params, env);
    const promise = fetchUpstreamWithRetry(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?${params.toString()}`, { headers: await driveAuthHeaders(env) }, { attempts: 3, timeoutMs: 12000 }).then(async res => {
        if (!res.ok) throw new Error(`Drive metadata HTTP ${res.status}: ${(await res.text().catch(() => "")).slice(0, 240)}`);
        const item = await res.json();
        if (!item || item.id !== fileId || !item.name || !item.mimeType) throw new Error("Resposta de metadados do Drive incompleta.");
        return item;
    });
    driveMetadataMemo.set(fileId, { expiresAt: now + 60000, promise });
    try { return await promise; }
    catch (e) { driveMetadataMemo.delete(fileId); throw e; }
}

async function collectCatalogMetadata(env, startingItems) {
    const catalog = await getR2Catalog(env);
    const records = new Map();
    const visited = new Set();
    async function walk(item, depth) {
        if (!item || !item.id || depth > 20 || visited.has(item.id)) return;
        visited.add(item.id);
        records.set(item.id, item);
        for (const parentId of Array.isArray(item.parents) ? item.parents : []) {
            if (!ID_RE.test(parentId) || parentId === R2_CATALOG_ROOT_ID || catalog?.byId.has(parentId)) continue;
            const parent = await getDriveMetadataForCatalog(parentId, env);
            await walk(parent, depth + 1);
        }
    }
    for (const item of startingItems) await walk(item, 0);
    return { catalog, records: [...records.values()] };
}

function stableCatalogJson(value) {
    if (Array.isArray(value)) return `[${value.map(stableCatalogJson).join(",")}]`;
    if (value && typeof value === "object") {
        const keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
        return `{${keys.map(key => `${JSON.stringify(key)}:${stableCatalogJson(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

function rememberCatalogUpdateFingerprint(key, item) {
    const now = Date.now();
    if (r2CatalogUpdateFingerprintMemo.size >= 10000) {
        for (const [memoKey, entry] of r2CatalogUpdateFingerprintMemo) {
            if (entry.expiresAt <= now) r2CatalogUpdateFingerprintMemo.delete(memoKey);
        }
        if (r2CatalogUpdateFingerprintMemo.size >= 10000) r2CatalogUpdateFingerprintMemo.clear();
    }
    r2CatalogUpdateFingerprintMemo.set(key, {
        fingerprint: stableCatalogJson(item),
        expiresAt: now + R2_CATALOG_UPDATE_MEMO_TTL_MS
    });
}

async function persistCatalogMetadataUpdates(env, state) {
    let saved = 0;
    for (const item of state.records) {
        if (!item || !item.id || state.catalog?.byId.has(item.id)) continue;
        const parents = Array.isArray(item.parents) ? item.parents : [];
        const fingerprint = stableCatalogJson(item);
        const serialized = JSON.stringify(item);
        for (const parentId of parents) {
            if (!ID_RE.test(parentId)) continue;
            const key = `${R2_CATALOG_UPDATE_PREFIX}${parentId}/${item.id}.json`;
            const memo = r2CatalogUpdateFingerprintMemo.get(key);
            if (memo && memo.expiresAt > Date.now() && memo.fingerprint === fingerprint) continue;
            if (!memo || memo.expiresAt <= Date.now()) {
                let existing = null;
                try { existing = await env.COMIC_CACHE.get(key); } catch (_) {}
                if (existing) {
                    try {
                        const existingItem = JSON.parse(await existing.text());
                        rememberCatalogUpdateFingerprint(key, existingItem);
                        if (stableCatalogJson(existingItem) === fingerprint) continue;
                    } catch (_) {}
                }
            }
            await env.COMIC_CACHE.put(key, serialized, { httpMetadata: { contentType: "application/json; charset=utf-8" } });
            rememberCatalogUpdateFingerprint(key, item);
            saved++;
        }
    }
    if (saved) r2CatalogUpdateListMemo.clear();
    return saved;
}

async function loadCatalogMetadataUpdates(env, parentId = null) {
    const memoKey = parentId || "__all__";
    const now = Date.now();
    const cached = r2CatalogUpdateListMemo.get(memoKey);
    if (cached && cached.expiresAt > now) return cached.items;

    const prefix = parentId ? `${R2_CATALOG_UPDATE_PREFIX}${parentId}/` : R2_CATALOG_UPDATE_PREFIX;
    const byId = new Map();
    let cursor;
    do {
        const page = await env.COMIC_CACHE.list({ prefix, limit: 1000, cursor });
        const objects = page.objects || [];
        for (let i = 0; i < objects.length; i += 40) {
            const batch = objects.slice(i, i + 40);
            const rows = await Promise.all(batch.map(async entry => {
                const obj = await env.COMIC_CACHE.get(entry.key);
                if (!obj) return null;
                const item = JSON.parse(await obj.text());
                return item && item.id && item.name ? { key: entry.key, item } : null;
            }));
            for (const row of rows) {
                if (!row) continue;
                byId.set(row.item.id, row.item);
                rememberCatalogUpdateFingerprint(row.key, row.item);
            }
        }
        cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);

    const items = [...byId.values()];
    if (items.length <= 5000) {
        if (r2CatalogUpdateListMemo.size >= R2_CATALOG_UPDATE_MEMO_MAX_ENTRIES) {
            for (const [key, entry] of r2CatalogUpdateListMemo) {
                if (entry.expiresAt <= now) r2CatalogUpdateListMemo.delete(key);
            }
            while (r2CatalogUpdateListMemo.size >= R2_CATALOG_UPDATE_MEMO_MAX_ENTRIES) {
                r2CatalogUpdateListMemo.delete(r2CatalogUpdateListMemo.keys().next().value);
            }
        }
        r2CatalogUpdateListMemo.set(memoKey, {
            items,
            expiresAt: Date.now() + R2_CATALOG_UPDATE_MEMO_TTL_MS
        });
    }
    return items;
}
function catalogJson(status, data) {
    return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" } });
}

function normalizeCatalogListingItem(item) {
    if (!item || item.mimeType !== "application/vnd.google-apps.shortcut") return item;
    const details = item.shortcutDetails || {};
    const targetId = String(details.targetId || "");
    const targetMimeType = String(details.targetMimeType || "");
    if (!ID_RE.test(targetId) || !targetMimeType) return item;
    const normalized = { ...item, id: targetId, mimeType: targetMimeType };
    delete normalized.shortcutDetails;
    return normalized;
}

function mergeCatalogUpdateIfNewer(merged, item) {
    item = normalizeCatalogListingItem(item);
    if (!item?.id) return;
    const current = merged.get(item.id);
    if (!current) { merged.set(item.id, item); return; }
    const currentTime = Date.parse(current.modifiedTime || "");
    const updateTime = Date.parse(item.modifiedTime || "");
    // O catálogo-base pode ter acabado de ser reconstituído. Não deixe uma
    // cópia incremental antiga esconder nomes/pais mais novos; registros sem
    // datas válidas mantêm a precedência histórica dos incrementos.
    if (Number.isFinite(currentTime) && currentTime > 0 && Number.isFinite(updateTime) && updateTime > 0) {
        if (updateTime > currentTime) merged.set(item.id, { ...current, ...item });
        return;
    }
    merged.set(item.id, { ...current, ...item });
}

async function handleAdminCatalogRepairR2(request, env) {
    const json = (status, data) => catalogJson(status, data);
    if (request.method !== "POST") return json(405, { error: "Use POST para reparar os registros do catálogo." });
    let body;
    try { body = await request.json(); }
    catch (_) { return json(400, { error: "Envie JSON válido com demolidorFolderId e sagaFolderId." }); }
    if (String(body?.demolidorFolderId || "") !== R2_DEMOLIDOR_FOLDER_ID || String(body?.sagaFolderId || "") !== R2_SAGA_XMEN_FOLDER_ID) {
        return json(400, { error: "Os IDs não correspondem às pastas desta correção." });
    }

    let catalog;
    try { catalog = await getR2Catalog(env); }
    catch (e) { return json(500, { error: "Não foi possível ler o catálogo do R2: " + String(e?.message || e) }); }
    if (!catalog || catalog.manifest.rootId !== R2_CATALOG_ROOT_ID) {
        return json(409, { error: "O catálogo-base não foi encontrado ou a raiz não corresponde à biblioteca." });
    }

    const merged = new Map();
    for (const item of catalog.manifest.items) {
        if (item && ID_RE.test(String(item.id || "")) && typeof item.name === "string") merged.set(item.id, item);
    }
    const demolidorRows = [
        { id: "1VKe7uB6BjaK6Vy3ANJ5JzH7FcjKuynSE", name: "Demolidor - Terra das Sombras.cbr" },
        { id: "1kb3cCEFTrdjBO7YLjlfEWWu6BGGy6yRd", name: "Marvel Essenciais - Demolidor - Pai.cbr" },
        { id: "18R5QPi3jIgbeo77Gq0HlWrSRPaLiDD_t", name: "Marvel Vintage - Demolidor - Fim dos Dias.cbr" }
    ];
    const exactRows = [...demolidorRows, ...R2_SAGA_XMEN_ITEMS];
    const cachedById = new Map();
    let exactR2Heads = 0;
    for (let i = 0; i < exactRows.length; i += 6) {
        const batch = exactRows.slice(i, i + 6);
        const results = await Promise.all(batch.map(async item => {
            exactR2Heads++;
            try { return { item, head: await env.COMIC_CACHE.head(`drive/${item.id}`), error: null }; }
            catch (error) { return { item, head: null, error }; }
        }));
        const failed = results.find(result => result.error);
        if (failed) return json(502, {
            error: `Falha ao verificar uma chave exata no R2 (${failed.item.id}); o catálogo não foi alterado.`,
            operations: { exactR2Heads, catalogWrites: 0, mediaDownloads: 0, bucketListings: 0 }
        });
        for (const result of results) if (result.head) cachedById.set(result.item.id, { ...result.item, size: result.head.size });
    }

    const demolidorFolder = merged.get(R2_DEMOLIDOR_FOLDER_ID) || {};
    merged.set(R2_DEMOLIDOR_FOLDER_ID, {
        ...demolidorFolder,
        id: R2_DEMOLIDOR_FOLDER_ID,
        name: "Coleção: Demolidor",
        mimeType: "application/vnd.google-apps.folder",
        parents: Array.isArray(demolidorFolder.parents) && demolidorFolder.parents.length ? demolidorFolder.parents : [R2_CATALOG_ROOT_ID]
    });
    const demolidorPresent = [];
    for (const row of demolidorRows) {
        const cached = cachedById.get(row.id);
        if (!cached) continue;
        const previous = merged.get(row.id) || {};
        merged.set(row.id, {
            ...previous,
            id: row.id,
            name: row.name,
            mimeType: previous.mimeType || "application/x-cbr",
            parents: [R2_DEMOLIDOR_FOLDER_ID],
            size: cached.size
        });
        demolidorPresent.push(row.id);
    }

    const sagaCached = R2_SAGA_XMEN_ITEMS.filter(item => cachedById.has(item.id));
    if (sagaCached.length) {
        merged.set(R2_SAGA_XMEN_FOLDER_ID, {
            ...(merged.get(R2_SAGA_XMEN_FOLDER_ID) || {}),
            id: R2_SAGA_XMEN_FOLDER_ID,
            name: "A Saga dos X-Men",
            mimeType: "application/vnd.google-apps.folder",
            parents: [R2_CATALOG_ROOT_ID],
            modifiedTime: "2026-11-25T02:55:29.323Z"
        });
        for (const item of sagaCached) {
            const previous = merged.get(item.id) || {};
            merged.set(item.id, {
                ...previous,
                id: item.id,
                name: item.name,
                mimeType: item.name.toLowerCase().endsWith(".cbz") ? "application/x-cbz" : "application/x-cbr",
                parents: [R2_SAGA_XMEN_FOLDER_ID],
                size: item.size
            });
        }
    }

    const manifest = {
        ...catalog.manifest,
        schemaVersion: 1,
        rootId: R2_CATALOG_ROOT_ID,
        generatedAt: new Date().toISOString(),
        items: [...merged.values()]
    };
    const bytes = new TextEncoder().encode(JSON.stringify(manifest));
    if (bytes.byteLength > MAX_CATALOG_BYTES) return json(413, { error: "O catálogo excederia 25 MB; nenhuma alteração foi feita." });
    try {
        await env.COMIC_CACHE.put(R2_CATALOG_KEY, bytes, { httpMetadata: { contentType: "application/json; charset=utf-8" } });
    } catch (e) {
        return json(500, { error: "Falha ao gravar o catálogo no R2: " + String(e?.message || e) });
    }
    r2CatalogMemo = { expiresAt: 0, value: null, loaded: false };
    r2CatalogUpdateListMemo.clear();

    let recentlyAdded = { saved: 0, present: 0, error: null };
    if (demolidorPresent.length) {
        const operation = sharedRecentAddedMutationQueue.then(async () => {
            const existingIds = await listSharedRecentAddedIds(env);
            const existing = new Set(existingIds);
            const writes = demolidorPresent.filter(id => !existing.has(id));
            try {
                await Promise.all(writes.map(id => env.ACCESS_CODES.put(`${SHARED_RECENT_ADDED_PREFIX}${id}`, "1")));
            } catch (error) {
                sharedRecentAddedMemo = { expiresAt: 0, ids: null };
                throw error;
            }
            const next = [...new Set([...existingIds, ...demolidorPresent])].sort();
            sharedRecentAddedMemo = { expiresAt: Date.now() + SHARED_RECENT_ADDED_MEMO_TTL_MS, ids: next };
            return { saved: writes.length, present: demolidorPresent.length };
        });
        sharedRecentAddedMutationQueue = operation.catch(() => {});
        try { recentlyAdded = await operation; }
        catch (e) { recentlyAdded.error = String(e?.message || e).slice(0, 180); }
    }

    return json(200, {
        saved: true,
        demolidorPresentInR2: demolidorPresent.length,
        demolidorIndexed: demolidorPresent,
        demolidorAddedRecently: recentlyAdded,
        saga: {
            repaired: sagaCached.length > 0,
            folderId: R2_SAGA_XMEN_FOLDER_ID,
            driveItems: R2_SAGA_XMEN_ITEMS.length,
            cachedComics: sagaCached.length,
            missingInR2: R2_SAGA_XMEN_ITEMS.length - sagaCached.length
        },
        catalogRecords: manifest.items.length,
        catalogBytes: bytes.byteLength,
        operations: { exactR2Heads, catalogWrites: 1, mediaDownloads: 0, bucketListings: 0 }
    });
}

async function handleAdminCatalogUpload(request, env) {
    if (request.method !== "PUT") return catalogJson(405, { error: "Use PUT para enviar o índice." });
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (declared > MAX_CATALOG_BYTES) return catalogJson(413, { error: "Índice muito grande (limite 25 MB)." });
    let bytes;
    try { bytes = await request.arrayBuffer(); }
    catch (_) { return catalogJson(400, { error: "Não foi possível ler o arquivo enviado." }); }
    if (!bytes.byteLength || bytes.byteLength > MAX_CATALOG_BYTES) return catalogJson(413, { error: "Índice vazio ou acima do limite de 25 MB." });
    let data;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); }
    catch (_) { return catalogJson(400, { error: "O arquivo enviado não contém JSON válido." }); }
    if (!data || data.schemaVersion !== 1 || !Array.isArray(data.items) || !data.rootId || data.items.length > 250000) {
        return catalogJson(400, { error: "Formato inválido; esperado schemaVersion 1, rootId e items[]." });
    }
    try {
        await env.COMIC_CACHE.put(R2_CATALOG_KEY, bytes, { httpMetadata: { contentType: "application/json; charset=utf-8" } });
        r2CatalogMemo = { expiresAt: 0, value: null, loaded: false };
        return catalogJson(200, { saved: true, key: R2_CATALOG_KEY, bytes: bytes.byteLength, items: data.items.length, generatedAt: data.generatedAt || null });
    } catch (e) { return catalogJson(500, { error: "Falha ao salvar o índice no R2: " + String(e) }); }
}

// Reindexação administrativa pontual: recebe uma fotografia dos metadados do
// Drive, enumera drive/ uma única vez (1 operação Classe A por página), e grava
// um único catálogo. Não faz HEAD/GET/PUT por HQ, nem é executada nas leituras
// normais do app.
async function handleAdminCatalogReindex(request, env) {
    const json = (status, data) => catalogJson(status, data);
    if (request.method !== "POST") return json(405, { error: "Use POST para enviar a fotografia de metadados." });
    const declared = Number(request.headers.get("Content-Length") || 0);
    if (declared > MAX_CATALOG_BYTES) return json(413, { error: "Fotografia muito grande (limite 25 MB)." });
    let payload;
    try {
        const bytes = await request.arrayBuffer();
        if (!bytes.byteLength || bytes.byteLength > MAX_CATALOG_BYTES) return json(413, { error: "Fotografia vazia ou acima do limite de 25 MB." });
        payload = JSON.parse(new TextDecoder().decode(bytes));
    } catch (_) { return json(400, { error: "Envie JSON válido com rootId e items[]." }); }
    if (!payload || payload.rootId !== R2_CATALOG_ROOT_ID || !Array.isArray(payload.items) || payload.items.length > 250000) {
        return json(400, { error: "Formato inválido; esperado rootId da biblioteca e items[] (máximo 250 mil)." });
    }

    let catalog;
    try { catalog = await getR2Catalog(env); }
    catch (e) { return json(500, { error: String(e?.message || e) }); }
    if (!catalog || catalog.manifest.rootId !== R2_CATALOG_ROOT_ID) {
        return json(409, { error: "O catálogo-base da biblioteca não foi encontrado no R2." });
    }

    const folderMime = "application/vnd.google-apps.folder";
    const shortcutMime = "application/vnd.google-apps.shortcut";
    const incoming = new Map();
    const shortcutIds = new Set();
    for (const raw of payload.items) {
        if (!raw || typeof raw.name !== "string" || !raw.name || typeof raw.mimeType !== "string") continue;
        const isShortcut = raw.mimeType === shortcutMime;
        const targetId = isShortcut ? raw.shortcutDetails?.targetId : raw.id;
        const targetMimeType = isShortcut ? raw.shortcutDetails?.targetMimeType : raw.mimeType;
        if (!ID_RE.test(String(targetId || "")) || !targetMimeType) continue;
        // Se o mesmo destino também aparece diretamente no Drive, prefira sua
        // localização/nome real em vez de um atalho; caso contrário, preserve
        // a localização do atalho como faz o cliente do aplicativo.
        if (incoming.has(targetId) && !shortcutIds.has(targetId) && isShortcut) continue;
        const item = {
            id: targetId,
            name: raw.name,
            mimeType: targetMimeType,
            parents: Array.isArray(raw.parents) ? [...new Set(raw.parents.filter(id => ID_RE.test(String(id))))] : []
        };
        for (const key of ["size", "createdTime", "modifiedTime", "thumbnailLink", "shortcutDetails"]) {
            if (!isShortcut && raw[key] !== undefined) item[key] = raw[key];
        }
        incoming.set(item.id, item);
        if (isShortcut) shortcutIds.add(item.id);
        else shortcutIds.delete(item.id);
    }

    // Somente itens cuja cadeia de pais chega à raiz são aceitos. Assim, uma
    // fotografia de outra pasta/conta não é injetada no catálogo da biblioteca.
    const reachesRootMemo = new Map([[R2_CATALOG_ROOT_ID, true]]);
    function reachesRoot(id, visiting = new Set()) {
        if (reachesRootMemo.has(id)) return reachesRootMemo.get(id);
        if (visiting.has(id)) return false;
        const item = incoming.get(id);
        if (!item) return false;
        visiting.add(id);
        const ok = item.parents.some(parent => reachesRoot(parent, visiting));
        visiting.delete(id);
        reachesRootMemo.set(id, ok);
        return ok;
    }

    const cachedIds = new Set();
    let cursor;
    let r2ListPages = 0;
    try {
        do {
            const page = await env.COMIC_CACHE.list({ prefix: "drive/", limit: 1000, cursor });
            r2ListPages++;
            for (const object of page.objects || []) cachedIds.add(object.key.slice("drive/".length));
            cursor = page.truncated ? page.cursor : undefined;
            if (cursor && r2ListPages >= 250) return json(413, { error: "O prefixo drive/ excedeu 250 mil objetos; nenhuma alteração foi feita." });
        } while (cursor);
    } catch (e) { return json(500, { error: "Falha ao listar objetos do R2; nenhuma alteração foi feita: " + String(e?.message || e) }); }

    const selected = new Map();
    for (const item of incoming.values()) {
        if (isReadableComicItem(item) && cachedIds.has(item.id) && reachesRoot(item.id)) selected.set(item.id, item);
    }
    // Acrescenta apenas pastas ancestrais dos arquivos confirmados no R2; não
    // expõe arquivos não armazenados, mesmo que apareçam na fotografia do Drive.
    for (const comic of [...selected.values()]) {
        let parentIds = [...comic.parents];
        let depth = 0;
        const visited = new Set([comic.id]);
        while (parentIds.length && depth++ < 20) {
            const next = [];
            for (const parentId of parentIds) {
                if (parentId === R2_CATALOG_ROOT_ID || visited.has(parentId)) continue;
                visited.add(parentId);
                const folder = incoming.get(parentId);
                if (!folder || folder.mimeType !== folderMime || !reachesRoot(parentId)) continue;
                selected.set(folder.id, folder);
                next.push(...folder.parents);
            }
            parentIds = next;
        }
    }

    const merged = new Map(catalog.manifest.items.filter(item => item && typeof item.id === "string").map(item => [item.id, item]));
    let addedRecords = 0;
    let refreshedRecords = 0;
    for (const [id, item] of selected) {
        const previous = merged.get(id);
        if (!previous) addedRecords++;
        else refreshedRecords++;
        merged.set(id, item);
    }
    const manifest = {
        ...catalog.manifest,
        schemaVersion: 1,
        rootId: R2_CATALOG_ROOT_ID,
        generatedAt: new Date().toISOString(),
        items: [...merged.values()]
    };
    const bytes = new TextEncoder().encode(JSON.stringify(manifest));
    if (bytes.byteLength > MAX_CATALOG_BYTES) return json(413, { error: "O catálogo atualizado excederia o limite de 25 MB; nenhuma alteração foi feita." });
    try {
        await env.COMIC_CACHE.put(R2_CATALOG_KEY, bytes, { httpMetadata: { contentType: "application/json; charset=utf-8" } });
        r2CatalogMemo = { expiresAt: 0, value: null, loaded: false };
        r2CatalogUpdateListMemo.clear();
        return json(200, {
            saved: true,
            cachedComicsIndexed: [...selected.values()].filter(isReadableComicItem).length,
            addedRecords,
            refreshedRecords,
            driveItemsReceived: incoming.size,
            r2ObjectsScanned: cachedIds.size,
            r2ListPages,
            r2Operations: { listPages: r2ListPages, catalogWrites: 1, perComicHeadGetOrPut: 0 },
            catalogBytes: bytes.byteLength
        });
    } catch (e) { return json(500, { error: "Falha ao salvar o catálogo atualizado no R2: " + String(e?.message || e) }); }
}

async function handleAdminCatalogMode(request, env) {
    if (request.method !== "PUT") return catalogJson(405, { error: "Use PUT para alterar o modo." });
    let data;
    try { data = await request.json(); }
    catch (_) { return catalogJson(400, { error: "Envie JSON com mode: r2-first ou r2-only." }); }
    if (!data || !["r2-first", "r2-only"].includes(data.mode)) return catalogJson(400, { error: "O modo deve ser r2-first ou r2-only." });
    try {
        const body = JSON.stringify({ mode: data.mode, updatedAt: new Date().toISOString() });
        await env.COMIC_CACHE.put(R2_CATALOG_MODE_KEY, body, { httpMetadata: { contentType: "application/json; charset=utf-8" } });
        r2OnlyMemo = { expiresAt: 0, value: data.mode === "r2-only", loaded: true };
        return catalogJson(200, { saved: true, key: R2_CATALOG_MODE_KEY, mode: data.mode });
    } catch (e) { return catalogJson(500, { error: "Falha ao salvar o modo no R2: " + String(e) }); }
}

function isReadableComicItem(item) {
    if (!item) return false;
    let mime = item.mimeType || "";
    let id = item.id || "";
    if (mime === "application/vnd.google-apps.folder") return false;
    if (mime === "application/vnd.google-apps.shortcut") {
        const detail = item.shortcutDetails || {};
        mime = detail.targetMimeType || "";
        id = detail.targetId || "";
    }
    const ext = /\.(pdf|cbz|cbr)$/i.exec(item.name || "");
    const supportedMime = new Set(["application/pdf", "application/zip", "application/x-cbz", "application/vnd.comicbook+zip", "application/x-zip-compressed", "application/x-rar-compressed", "application/vnd.rar", "application/x-cbr", "application/vnd.comicbook-rar", "application/x-rar"]);
    return !!id && (!!ext || supportedMime.has(mime));
}

async function handleAdminCatalogCoverage(env) {
    const json = (status, data) => catalogJson(status, data);
    let catalog;
    try { catalog = await getR2Catalog(env); }
    catch (e) { return json(500, { error: String(e) }); }
    if (!catalog) return json(409, { error: "O índice catalog/index.json ainda não foi enviado ao R2." });
    const effectiveItems = new Map(catalog.allItems.map(item => [item.id, item]));
    try {
        for (const item of await loadCatalogMetadataUpdates(env)) effectiveItems.set(item.id, item);
    } catch (e) { return json(500, { error: "Falha ao ler atualizações do catálogo: " + String(e) }); }
    const expected = new Map();
    for (const item of effectiveItems.values()) {
        if (!isReadableComicItem(item)) continue;
        const id = item.mimeType === "application/vnd.google-apps.shortcut" ? item.shortcutDetails?.targetId : item.id;
        if (id) expected.set(id, item.name || id);
    }
    const found = new Set();
    let storedObjects = 0;
    let storedBytes = 0;
    let cursor;
    try {
        do {
            const page = await env.COMIC_CACHE.list({ prefix: "drive/", limit: 1000, cursor });
            for (const object of page.objects || []) {
                storedObjects++;
                storedBytes += Number(object.size) || 0;
                const id = object.key.slice("drive/".length);
                if (expected.has(id)) found.add(id);
            }
            cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
    } catch (e) { return json(500, { error: "Falha ao comparar objetos no R2: " + String(e) }); }
    const missing = [];
    for (const [id, name] of expected) if (!found.has(id)) missing.push({ id, name });
    return json(200, {
        r2OnlyReady: missing.length === 0,
        expectedComicFiles: expected.size,
        presentInR2: found.size,
        missingCount: missing.length,
        missingExamples: missing.slice(0, 100),
        missingListTruncated: missing.length > 100,
        r2DriveObjects: storedObjects,
        r2DriveBytes: storedBytes
    });
}

async function listSharedRecentAddedIds(env, force = false) {
    const now = Date.now();
    if (!force && Array.isArray(sharedRecentAddedMemo.ids) && now < sharedRecentAddedMemo.expiresAt) {
        return sharedRecentAddedMemo.ids.slice();
    }
    const ids = new Set();
    let cursor;
    let pages = 0;
    do {
        const listing = await env.ACCESS_CODES.list({ prefix: SHARED_RECENT_ADDED_PREFIX, limit: 1000, cursor });
        for (const key of listing.keys || []) {
            const id = String(key.name || "").slice(SHARED_RECENT_ADDED_PREFIX.length);
            if (ID_RE.test(id)) ids.add(id);
        }
        if (ids.size > SHARED_RECENT_ADDED_MAX_IDS) throw new Error("O histórico compartilhado ultrapassou o limite seguro de IDs.");
        cursor = listing.list_complete ? undefined : listing.cursor;
        pages++;
        if (pages > Math.ceil(SHARED_RECENT_ADDED_MAX_IDS / 1000) + 1) throw new Error("A paginação do histórico compartilhado excedeu o limite seguro.");
    } while (cursor);
    const result = [...ids].sort();
    sharedRecentAddedMemo = { expiresAt: now + SHARED_RECENT_ADDED_MEMO_TTL_MS, ids: result };
    return result.slice();
}

function cleanSharedRecentIdArray(value, field) {
    if (!Array.isArray(value) || value.length > SHARED_RECENT_ADDED_MAX_IDS) throw new Error(`Campo ${field} inválido ou grande demais.`);
    const ids = new Set();
    for (const item of value) {
        const id = String(item || "");
        if (!ID_RE.test(id)) throw new Error(`ID inválido no campo ${field}.`);
        ids.add(id);
    }
    return ids;
}

async function handleSharedRecentAdded(request, env) {
    const json = (status, data) => new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders(), "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
    try {
        if (request.method === "GET") {
            return json(200, { ids: await listSharedRecentAddedIds(env) });
        }
        const declaredLength = Number(request.headers.get("Content-Length") || 0);
        if (declaredLength > SHARED_RECENT_ADDED_MAX_BODY_BYTES) return json(413, { error: "Sincronização de recentes grande demais." });
        const rawBody = await request.text();
        if (new TextEncoder().encode(rawBody).byteLength > SHARED_RECENT_ADDED_MAX_BODY_BYTES) return json(413, { error: "Sincronização de recentes grande demais." });
        const body = JSON.parse(rawBody || "{}");
        const rootIds = cleanSharedRecentIdArray(body.rootIds, "rootIds");
        const libraryIds = cleanSharedRecentIdArray(body.libraryIds, "libraryIds");
        const knownIds = cleanSharedRecentIdArray(body.knownIds || [], "knownIds");
        for (const id of rootIds) if (!libraryIds.has(id)) return json(400, { error: "Uma HQ da raiz não consta na lista completa da biblioteca." });

        const mutate = async () => {
            const existingIds = await listSharedRecentAddedIds(env);
            const existing = new Set(existingIds);
            const additions = new Set([...rootIds, ...knownIds]);
            for (const id of additions) if (!libraryIds.has(id)) additions.delete(id);
            const writes = [...additions].filter(id => !existing.has(id));
            try {
                await Promise.all(writes.map(id => env.ACCESS_CODES.put(`${SHARED_RECENT_ADDED_PREFIX}${id}`, "1")));
            } catch (error) {
                sharedRecentAddedMemo = { expiresAt: 0, ids: null };
                throw error;
            }
            // A Drive scan can return HTTP 200 with a partial/empty list when a
            // folder becomes private. Absence from one client's snapshot is not
            // proof that a comic left the library, so never delete shared history
            // from this synchronization path. The app displays an ID only while
            // its R2/Drive catalogue still supplies the comic record.
            const next = [...new Set([...existingIds, ...additions])].sort();
            sharedRecentAddedMemo = { expiresAt: Date.now() + SHARED_RECENT_ADDED_MEMO_TTL_MS, ids: next };
            return json(200, { ids: next, added: writes.length, removed: 0 });
        };
        const operation = sharedRecentAddedMutationQueue.then(mutate, mutate);
        sharedRecentAddedMutationQueue = operation.catch(() => {});
        return await operation;
    } catch (error) {
        console.error("[PlanetaHQ Worker] shared recent-added sync failed", String(error?.message || error).slice(0, 240));
        return json(400, { error: String(error?.message || "Falha no histórico compartilhado.").slice(0, 240) });
    }
}

async function handleDriveList(url, env, ctx) {
    const json = (status, data) => catalogJson(status, data);
    const q = url.searchParams.get("q") || "";
    const pageToken = url.searchParams.get("pageToken") || "";
    if (q.length > 300 || !(PARENT_Q_RE.test(q) || NAME_Q_RE.test(q))) return json(400, { error: "Consulta não permitida." });
    if (pageToken.length > 2000) return json(400, { error: "pageToken inválido." });
    let catalog;
    try { catalog = await getR2Catalog(env); }
    catch (e) { return json(500, { error: String(e) }); }
    if (!catalog) {
        if (await isR2OnlyMode(env)) return json(503, { error: "O catálogo R2-only está ativo, mas catalog/index.json não foi encontrado." });
        return handleDriveListFromDrive(url, env);
    }
    let items;
        const parentMatch = /^'([A-Za-z0-9_-]{10,100})' in parents and trashed = false$/.exec(q);
        try {
            if (parentMatch) {
                const merged = new Map();
                for (const item of catalog.byParent.get(parentMatch[1]) || []) mergeCatalogUpdateIfNewer(merged, item);
                // These warmed objects are a known, verified R2 collection. Keep
                // its directory listing available even if the live Drive query
                // returns no children or the main index is stale. This does not
                // create a ficha or bypass the app's existing ficha filter.
                if (parentMatch[1] === R2_CATALOG_ROOT_ID) {
                    const id = R2_SAGA_XMEN_FOLDER_ID;
                    const current = merged.get(id) || {};
                    merged.set(id, {
                        ...current,
                        id,
                        name: "A Saga dos X-Men",
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [...new Set([...(Array.isArray(current.parents) ? current.parents : []), R2_CATALOG_ROOT_ID])]
                    });
                } else if (parentMatch[1] === R2_SAGA_XMEN_FOLDER_ID) {
                    for (const row of R2_SAGA_XMEN_ITEMS) {
                        const current = merged.get(row.id) || {};
                        const inferredMime = /\.cbz$/i.test(row.name) ? "application/x-cbz" : "application/x-cbr";
                        merged.set(row.id, {
                            ...current,
                            ...row,
                            mimeType: current.mimeType || inferredMime,
                            parents: [...new Set([...(Array.isArray(current.parents) ? current.parents : []), R2_SAGA_XMEN_FOLDER_ID])]
                        });
                    }
                }
                items = [...merged.values()];
            // R2-first: combine the indexed catalogue with the live folder contents.
            // In this mode the live Drive response is authoritative for the folder.
            // Do not list catalog/updates/<folder>/ and GET every update on every
            // folder request: that turns a library crawl into R2 Class A + B fan-out.
            // R2-only still merges persisted updates below because Drive is disabled.
            const r2Only = await isR2OnlyMode(env);
            if (r2Only) {
                const parentUpdates = await loadCatalogMetadataUpdates(env, parentMatch[1]);
                for (const item of parentUpdates) mergeCatalogUpdateIfNewer(merged, item);
                items = [...merged.values()];
            } else if (hasDriveAccessCredentials(env)) {
                const pageToken = url.searchParams.get("pageToken") || "";
                const r2OffsetMatch = /^r2:(\d+)$/.exec(pageToken);
                const offset = r2OffsetMatch ? Number(r2OffsetMatch[1]) : 0;
                let drivePageToken = r2OffsetMatch ? "" : pageToken;
                const liveItems = [];
                let liveOk = true;
                const liveStartedAt = Date.now();
                for (let page = 0; page < 100; page++) {
                    if (Date.now() - liveStartedAt > 6500) { liveOk = false; break; }
                    const liveUrl = new URL(url);
                    liveUrl.searchParams.delete("pageToken");
                    if (drivePageToken) liveUrl.searchParams.set("pageToken", drivePageToken);
                    const response = await handleDriveListFromDrive(liveUrl, env, { attempts: 1, timeoutMs: 6000 });
                    if (!response.ok) { liveOk = false; break; }
                    let payload;
                    try { payload = await response.json(); } catch (_) { liveOk = false; break; }
                    liveItems.push(...(Array.isArray(payload.files) ? payload.files : []));
                    drivePageToken = payload.nextPageToken || "";
                    if (!drivePageToken) break;
                    if (page === 99) liveOk = false;
                }
                    if (liveOk && liveItems.length > 0) {
                    for (const rawItem of liveItems) {
                        const item = normalizeCatalogListingItem(rawItem);
                        if (!item?.id) continue;
                        merged.set(item.id, { ...(merged.get(item.id) || {}), ...item });
                    }
                    items = [...merged.values()];
                    // New/changed files remain visible from the live Drive listing.
                    // Catalog metadata is published by the explicit admin warm/index
                    // flows, not by HEAD-checking every comic during normal app reads.
                } else if (!liveOk || merged.size === 0) {
                    // Drive failed or returned no visible children for a parent
                    // missing from the main index. Read incremental metadata only
                    // in those cases; do not add LIST/GET fan-out for every private
                    // folder whose children are already present in catalog/index.
                    const parentUpdates = await loadCatalogMetadataUpdates(env, parentMatch[1]);
                    for (const item of parentUpdates) mergeCatalogUpdateIfNewer(merged, item);
                    items = [...merged.values()];
                } else {
                    // Empty live result, but the main R2 index already contains the
                    // children; serve that snapshot without further R2 operations.
                    items = [...merged.values()];
                }
            } else {
                // Without a live Drive key, use the stored snapshot and updates.
                const parentUpdates = await loadCatalogMetadataUpdates(env, parentMatch[1]);
                for (const item of parentUpdates) mergeCatalogUpdateIfNewer(merged, item);
                items = [...merged.values()];
            }
        } else {
            const nameMatch = /^name contains '((?:[^'\\]|\\.)*)' and trashed = false$/.exec(q);
            if (!nameMatch) return json(400, { error: "Consulta não permitida." });
            const needle = nameMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\").toLocaleLowerCase();
            const merged = new Map();
            for (const item of catalog.allItems) mergeCatalogUpdateIfNewer(merged, item);
            for (const item of await loadCatalogMetadataUpdates(env)) mergeCatalogUpdateIfNewer(merged, item);
            items = [...merged.values()].filter(item => String(item.name || "").toLocaleLowerCase().includes(needle));
        }
    } catch (e) { return json(500, { error: "Falha ao mesclar atualizações incrementais do catálogo: " + String(e) }); }
    let offset = 0;
    if (pageToken) {
        const match = /^r2:(\d+)$/.exec(pageToken);
        if (!match) return json(400, { error: "pageToken R2 inválido; atualize a lista e tente novamente." });
        offset = Number(match[1]);
    }
    const pageSize = 1000;
    const files = items.slice(offset, offset + pageSize);
    const nextPageToken = offset + files.length < items.length ? `r2:${offset + files.length}` : null;
    return json(200, { files, nextPageToken });
}

async function handleDriveListFromDrive(url, env, retryOptions = {}) {
    const json = (status, obj) => new Response(JSON.stringify(obj), {
        status: status,
        headers: {
            ...corsHeaders(),
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        }
    });
    if (!hasDriveAccessCredentials(env)) return json(500, {
        error: "Configure DRIVE_SERVICE_ACCOUNT_JSON ou DRIVE_API_KEY no Worker."
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
        fields: "nextPageToken, files(id,name,mimeType,size,createdTime,modifiedTime,shortcutDetails,thumbnailLink,parents)",
        pageSize: "1000",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true",
    });
    addDriveApiKeyIfNeeded(params, env);
    if (pageToken) params.set("pageToken", pageToken);
    try {
        const res = await fetchUpstreamWithRetry(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, { headers: await driveAuthHeaders(env) }, {
            attempts: retryOptions.attempts ?? 3,
            timeoutMs: retryOptions.timeoutMs ?? 12e3
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

async function revokeAccessByCode(rawCode, env) {
    const code = normalizeCode(rawCode);
    if (!/^[A-Z0-9]{8}$/.test(code)) {
        return { ok: false, error: "Código inválido: informe o código completo de 8 caracteres." };
    }
    const accessKey = `access:${code}`;
    const existing = await env.ACCESS_CODES.get(accessKey);
    if (!existing) {
        return { ok: true, revoked: false, notFound: true, deletedEmailMappings: 0 };
    }
    await env.ACCESS_CODES.delete(accessKey);

    // Remove apenas vínculos email:* que apontem para este código específico.
    let deletedEmailMappings = 0;
    let cursor;
    do {
        const options = { prefix: "email:" };
        if (cursor) options.cursor = cursor;
        const page = await env.ACCESS_CODES.list(options);
        for (const key of page.keys || []) {
            const mappedCode = await env.ACCESS_CODES.get(key.name);
            if (mappedCode && normalizeCode(mappedCode) === code) {
                await env.ACCESS_CODES.delete(key.name);
                deletedEmailMappings++;
            }
        }
        cursor = page.list_complete ? null : page.cursor;
    } while (cursor);

    return { ok: true, revoked: true, notFound: false, deletedEmailMappings };
}

async function revokeAccessByEmail(rawEmail, env) {
    const email = String(rawEmail || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
        return { ok: false, error: "E-mail inválido." };
    }
    const emailKey = `email:${email}`;
    const rawMappedCode = await env.ACCESS_CODES.get(emailKey);
    const mappedCode = normalizeCode(rawMappedCode || "");
    const emailMappingFound = !!rawMappedCode;
    let deletedCodes = 0;
    let directDeletionCompleted = false;

    // O fluxo normal mantém um vínculo direto email:<endereço> -> código.
    // Remova esse código sem percorrer a base inteira de usuários.
    if (/^[A-Z0-9]{8}$/.test(mappedCode)) {
        const accessKey = `access:${mappedCode}`;
        const raw = await env.ACCESS_CODES.get(accessKey);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                const storedEmail = String(data?.email || "").trim().toLowerCase();
                // Não revogue um registro que, por inconsistência, pertença a
                // outro e-mail. Nesse caso, o fallback procura a associação real.
                if (storedEmail === email) {
                    await env.ACCESS_CODES.delete(accessKey);
                    deletedCodes++;
                    directDeletionCompleted = true;
                }
            } catch (_) {}
        }
    }

    // Se o vínculo estiver ausente/órfão, procure registros antigos em lotes
    // paralelos. A versão anterior fazia um KV.get sequencial para cada usuário,
    // o que podia deixar a solicitação carregando por muito tempo.
    if (!directDeletionCompleted) {
        let cursor;
        do {
            const options = { prefix: "access:" };
            if (cursor) options.cursor = cursor;
            const page = await env.ACCESS_CODES.list(options);
            const keys = page.keys || [];
            const batchSize = 50;
            for (let i = 0; i < keys.length; i += batchSize) {
                const batch = keys.slice(i, i + batchSize);
                const removed = await Promise.all(batch.map(async key => {
                    try {
                        const raw = await env.ACCESS_CODES.get(key.name);
                        if (!raw) return false;
                        const data = JSON.parse(raw);
                        const storedEmail = String(data?.email || "").trim().toLowerCase();
                        if (storedEmail !== email) return false;
                        await env.ACCESS_CODES.delete(key.name);
                        return true;
                    } catch (_) {
                        return false;
                    }
                }));
                deletedCodes += removed.filter(Boolean).length;
            }
            cursor = page.list_complete ? null : page.cursor;
        } while (cursor);
    }

    // Apague o índice só depois da tentativa de revogação para que, em caso de
    // erro na varredura alternativa, a operação possa ser repetida com segurança.
    await env.ACCESS_CODES.delete(emailKey);

    return {
        ok: true,
        revoked: true,
        email,
        deletedCodes,
        emailMappingFound
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
