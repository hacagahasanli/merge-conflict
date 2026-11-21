/* Nalbaki Games telemetry client v1. Generated from nalbaki-stats/client/telemetry.ts; do not edit. */
(function(){
'use strict';
const DAY = 86400000;
const AID_KEY = 'nb_aid';
const SID_KEY = 'nb_sid';
const Q_KEY = 'nb_q';
const OFF_KEY = 'nb_off';
const AID_TTL = 395 * DAY;
const IDLE_MS = 30 * 60 * 1000;
const MAX_SESSION_MS = 23 * 60 * 60 * 1000;
const MAX_QUEUE = 200;
const MAX_BATCH_EVENTS = 50;
const MAX_BATCH_BYTES = 16 * 1024;
const FLUSH_AT = 20;
const FLUSH_EVERY = 10000;
const PING_EVERY = 60000;
const BACKOFF = [10000, 30000, 120000, 600000];
const MAX_STR = 120;
const MAX_JS_ERRORS = 3;
let S = null;
const mem = {};
const read = (area, k) => {
var _a;
try {
const v = (area === 'local' ? window.localStorage : window.sessionStorage).getItem(k);
return v === null && mem[area + k] !== undefined ? mem[area + k] : v;
}
catch {
return (_a = mem[area + k]) !== null && _a !== void 0 ? _a : null;
}
};
const write = (area, k, v) => {
mem[area + k] = v;
try {
(area === 'local' ? window.localStorage : window.sessionStorage).setItem(k, v);
}
catch {
}
};
const remove = (area, k) => {
delete mem[area + k];
try {
(area === 'local' ? window.localStorage : window.sessionStorage).removeItem(k);
}
catch {
}
};
const parse = (s) => {
if (!s)
return null;
try {
return JSON.parse(s);
}
catch {
return null;
}
};
const uuid = () => {
const c = typeof crypto !== 'undefined' ? crypto : undefined;
if (c && typeof c.randomUUID === 'function')
return c.randomUUID();
const b = new Uint8Array(16);
if (c && c.getRandomValues)
c.getRandomValues(b);
else
for (let k = 0; k < 16; k++)
b[k] = Math.floor(Math.random() * 256);
b[6] = (b[6] & 0x0f) | 0x40;
b[8] = (b[8] & 0x3f) | 0x80;
const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};
const clip = (v) => (v.length > MAX_STR ? v.slice(0, MAX_STR) : v);
const cleanProps = (p) => {
if (!p || typeof p !== 'object')
return undefined;
const out = {};
for (const k of Object.keys(p)) {
const v = p[k];
if (typeof v === 'string')
out[k] = clip(v);
else if (typeof v === 'number') {
if (isFinite(v))
out[k] = Math.round(v * 1000) / 1000;
}
else if (typeof v === 'boolean')
out[k] = v;
}
return Object.keys(out).length ? out : undefined;
};
const optedOut = () => {
try {
return read('local', OFF_KEY) === '1';
}
catch {
return false;
}
};
const isOff = () => {
if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined')
return true;
const nav = navigator;
if (nav.webdriver === true || nav.globalPrivacyControl === true)
return true;
try {
const q = new URLSearchParams(window.location.search);
if (q.has('nostats'))
write('local', OFF_KEY, '1');
else if (q.get('stats') === 'on')
remove('local', OFF_KEY);
}
catch {
}
return optedOut();
};
function optOut() {
try {
write('local', OFF_KEY, '1');
remove('local', Q_KEY);
remove('local', AID_KEY);
remove('session', SID_KEY);
S = null;
}
catch {
}
}
function optIn() {
try {
remove('local', OFF_KEY);
}
catch {
}
}
function isOptedOut() {
try {
return typeof window !== 'undefined' && optedOut();
}
catch {
return false;
}
}
const saveQueue = () => {
if (!S)
return;
if (S.queue.length)
write('local', Q_KEY, JSON.stringify(S.queue));
else
remove('local', Q_KEY);
};
const capQueue = () => {
if (S && S.queue.length > MAX_QUEUE)
S.queue.splice(0, S.queue.length - MAX_QUEUE);
};
const saveSession = () => {
if (S)
write('session', SID_KEY, JSON.stringify(S.sess));
};
const ensureSession = (now) => {
if (!S)
return false;
const s = S.sess;
if (s.id && now - s.last <= IDLE_MS && now - s.start <= MAX_SESSION_MS)
return false;
S.sess = { id: uuid(), start: now, last: now, s: 0, errors: 0 };
saveSession();
return true;
};
const screenSize = () => {
const w = Math.min(window.innerWidth || 0, window.innerHeight || window.innerWidth || 0) || window.innerWidth || 0;
return w < 600 ? 's' : w < 1024 ? 'm' : 'l';
};
const refHost = () => {
try {
if (!document.referrer)
return undefined;
const h = new URL(document.referrer).hostname;
return h && h !== window.location.hostname ? clip(h) : undefined;
}
catch {
return undefined;
}
};
const sessionStartProps = () => {
var _a, _b;
const p = {};
const ref = refHost();
if (ref)
p.ref = ref;
try {
const q = new URLSearchParams(window.location.search);
for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
const v = q.get(k);
if (v)
p[k] = clip(v);
}
p.path = clip(window.location.pathname);
}
catch {
}
const lang = (navigator.language || '').split('-')[0];
if (lang)
p.lang = clip(lang.toLowerCase());
p.screen = screenSize();
p.touch = typeof window.matchMedia === 'function' ? window.matchMedia('(pointer: coarse)').matches : 'ontouchstart' in window;
p.returning = (_a = S === null || S === void 0 ? void 0 : S.returning) !== null && _a !== void 0 ? _a : false;
p.days_since_first = (_b = S === null || S === void 0 ? void 0 : S.daysSinceFirst) !== null && _b !== void 0 ? _b : 0;
return p;
};
const push = (n, p) => {
if (!S)
return;
const now = Date.now();
if (ensureSession(now))
pushRaw('session_start', now, cleanProps(sessionStartProps()));
pushRaw(n, now, p);
};
const pushRaw = (n, now, p) => {
if (!S)
return;
const sess = S.sess;
const item = { g: S.o.game, b: S.o.build, a: S.aid, i: sess.id, n, s: sess.s, t: Math.max(0, Math.min(now - sess.start, 86400000)), ...(p ? { p } : {}) };
sess.s += 1;
sess.last = now;
saveSession();
S.queue.push(item);
capQueue();
saveQueue();
if (S.queue.length >= FLUSH_AT)
void send(false);
};
const takeBatch = () => {
if (!S || !S.queue.length)
return null;
const first = S.queue[0];
const items = [];
const events = [];
const head = { v: 1, g: first.g, build: first.b, aid: first.a, sid: first.i };
let body = JSON.stringify({ ...head, e: events });
for (const it of S.queue) {
if (it.g !== first.g || it.b !== first.b || it.a !== first.a || it.i !== first.i || events.length >= MAX_BATCH_EVENTS)
break;
events.push({ n: it.n, s: it.s, t: it.t, ...(it.p ? { p: it.p } : {}) });
const next = JSON.stringify({ ...head, e: events });
if (next.length > MAX_BATCH_BYTES && events.length > 1) {
events.pop();
break;
}
body = next;
items.push(it);
}
S.queue.splice(0, items.length);
saveQueue();
return { body, items };
};
const requeue = (items) => {
if (!S)
return;
S.queue.unshift(...items);
capQueue();
saveQueue();
};
const fail = () => {
if (!S)
return;
S.nextAt = Date.now() + BACKOFF[Math.min(S.fails, BACKOFF.length - 1)];
S.fails += 1;
};
const send = async (hiding) => {
if (!S)
return;
const url = S.o.endpoint;
if (hiding) {
while (S && S.queue.length) {
const b = takeBatch();
if (!b)
return;
let queued = false;
try {
queued = typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(url, new Blob([b.body], { type: 'text/plain;charset=UTF-8' }));
}
catch {
queued = false;
}
if (!queued) {
requeue(b.items);
return;
}
}
return;
}
if (S.busy || Date.now() < S.nextAt || typeof fetch !== 'function')
return;
const b = takeBatch();
if (!b)
return;
S.busy = true;
try {
const res = await fetch(url, { method: 'POST', body: b.body, keepalive: true, credentials: 'omit', headers: { 'content-type': 'text/plain;charset=UTF-8' } });
if (!S)
return;
S.busy = false;
if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) {
S.fails = 0;
S.nextAt = 0;
if (S.queue.length)
void send(false);
}
else {
requeue(b.items);
fail();
}
}
catch {
if (!S)
return;
S.busy = false;
requeue(b.items);
fail();
}
};
const onError = (kind, raw) => {
if (!S)
return;
const msg = clip(String(raw !== null && raw !== void 0 ? raw : '').replace(/https?:\/\/\S+/g, '<url>'));
if (S.loading && !S.loadFailed) {
S.loadFailed = true;
push('load_fail', cleanProps({ stage: 'boot', msg }));
return;
}
if (S.sess.errors >= MAX_JS_ERRORS)
return;
S.sess.errors += 1;
push('js_error', cleanProps({ kind, msg }));
};
function init(o) {
var _a;
try {
if (S || !o || !o.endpoint || isOff())
return;
const now = Date.now();
const rec = parse(read('local', AID_KEY));
let aid;
let created;
let returning = false;
if (rec && typeof rec.id === 'string' && typeof rec.created === 'number' && now - rec.created < AID_TTL && now >= rec.created) {
aid = rec.id;
created = rec.created;
returning = true;
}
else {
aid = uuid();
created = now;
write('local', AID_KEY, JSON.stringify({ id: aid, created }));
}
const stored = parse(read('session', SID_KEY));
const queue = ((_a = parse(read('local', Q_KEY))) !== null && _a !== void 0 ? _a : []).filter((x) => x && typeof x.i === 'string' && typeof x.s === 'number');
S = {
o: { endpoint: o.endpoint, game: o.game, build: o.build },
aid,
returning,
daysSinceFirst: Math.floor((now - created) / DAY),
sess: stored && typeof stored.id === 'string' && typeof stored.start === 'number' ? stored : { id: '', start: 0, last: 0, s: 0, errors: 0 },
queue,
busy: false,
fails: 0,
nextAt: 0,
loading: false,
loadFailed: false,
bootAt: typeof performance !== 'undefined' ? performance.now() : 0,
};
capQueue();
if (ensureSession(now))
pushRaw('session_start', now, cleanProps(sessionStartProps()));
const hide = () => {
if (!S)
return;
if (document.visibilityState === 'hidden' && S.o.game !== 'site')
push('ping', undefined);
void send(true);
};
document.addEventListener('visibilitychange', () => {
if (document.visibilityState === 'hidden')
hide();
});
window.addEventListener('pagehide', () => void send(true));
window.addEventListener('error', (e) => onError('error', e.message));
window.addEventListener('unhandledrejection', (e) => onError('promise', e.reason && e.reason.message ? e.reason.message : e.reason));
setInterval(() => void send(false), FLUSH_EVERY);
if (o.game !== 'site')
setInterval(() => document.visibilityState === 'visible' && push('ping', undefined), PING_EVERY);
if (queue.length)
void send(false);
}
catch {
S = null;
}
}
function track(name, ...args) {
try {
if (!S)
return;
if (name === 'load_start') {
S.loading = true;
S.loadFailed = false;
S.bootAt = typeof performance !== 'undefined' ? performance.now() : 0;
}
if (name === 'js_error') {
if (S.sess.errors >= MAX_JS_ERRORS)
return;
S.sess.errors += 1;
}
push(name, cleanProps(args[0]));
}
catch {
}
}
function loadDone() {
try {
if (!S || !S.loading)
return;
S.loading = false;
const ms = typeof performance !== 'undefined' ? Math.round(performance.now() - S.bootAt) : 0;
push('load_done', { ms: Math.max(0, ms) });
}
catch {
}
}
function flush() {
try {
void send(typeof document !== 'undefined' && document.visibilityState === 'hidden');
}
catch {
}
}
window.nbStats={optOut,optIn,isOptedOut,init,track,loadDone,flush};
})();
