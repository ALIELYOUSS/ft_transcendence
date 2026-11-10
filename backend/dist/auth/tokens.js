"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_COOKIE = void 0;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.hashRefreshToken = hashRefreshToken;
exports.refreshTokenMatches = refreshTokenMatches;
exports.setRefreshCookie = setRefreshCookie;
exports.clearRefreshCookie = clearRefreshCookie;
const node_crypto_1 = require("node:crypto");
const Jwt = require('jsonwebtoken');
function signAccessToken(userId) {
    return Jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}
function signRefreshToken(userId) {
    return Jwt.sign({ sub: userId, jti: (0, node_crypto_1.randomUUID)() }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
}
function verifyAccessToken(token) {
    return readUserId(token, process.env.ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token) {
    return readUserId(token, process.env.REFRESH_TOKEN_SECRET);
}
function readUserId(token, secret) {
    try {
        const payload = Jwt.verify(token, secret);
        return typeof payload.sub === 'string' ? payload.sub : null;
    }
    catch {
        return null;
    }
}
function hashRefreshToken(token) {
    return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
}
function refreshTokenMatches(token, storedHash) {
    const expected = Buffer.from(storedHash);
    const actual = Buffer.from(hashRefreshToken(token));
    return expected.length === actual.length && (0, node_crypto_1.timingSafeEqual)(expected, actual);
}
exports.REFRESH_COOKIE = 'refreshToken';
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth',
};
function setRefreshCookie(res, token) {
    res.cookie(exports.REFRESH_COOKIE, token, { ...REFRESH_COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
function clearRefreshCookie(res) {
    res.clearCookie(exports.REFRESH_COOKIE, REFRESH_COOKIE_OPTIONS);
}
//# sourceMappingURL=tokens.js.map