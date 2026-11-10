"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GoogleCallbackGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCallbackGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let GoogleCallbackGuard = GoogleCallbackGuard_1 = class GoogleCallbackGuard extends (0, passport_1.AuthGuard)('google') {
    logger = new common_1.Logger(GoogleCallbackGuard_1.name);
    handleRequest(err, user, info) {
        if (err || !user) {
            const reason = err instanceof Error ? err.message : JSON.stringify(info ?? err);
            this.logger.warn(`Google sign-in rejected: ${reason}`);
        }
        return user || null;
    }
};
exports.GoogleCallbackGuard = GoogleCallbackGuard;
exports.GoogleCallbackGuard = GoogleCallbackGuard = GoogleCallbackGuard_1 = __decorate([
    (0, common_1.Injectable)()
], GoogleCallbackGuard);
//# sourceMappingURL=google-callback.guard.js.map