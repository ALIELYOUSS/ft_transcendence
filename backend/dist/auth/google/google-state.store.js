"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieStateStore = void 0;
const node_crypto_1 = require("node:crypto");
const STATE_COOKIE = 'oauth_state';
const STATE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/api/auth/google',
};
const googleStateStore = {
    store(req, _meta, done) {
        const state = (0, node_crypto_1.randomBytes)(32).toString('hex');
        req.res.cookie(STATE_COOKIE, state, { ...STATE_COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
        done(null, state);
    },
    verify(req, state, done) {
        const expected = req.cookies?.[STATE_COOKIE];
        req.res.clearCookie(STATE_COOKIE, STATE_COOKIE_OPTIONS);
        const ok = typeof expected === 'string' &&
            typeof state === 'string' &&
            expected.length === state.length &&
            (0, node_crypto_1.timingSafeEqual)(Buffer.from(expected), Buffer.from(state));
        done(null, ok, ok ? state : { message: 'Invalid OAuth state' });
    },
};
exports.cookieStateStore = googleStateStore;
//# sourceMappingURL=google-state.store.js.map