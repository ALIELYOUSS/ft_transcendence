declare const GoogleCallbackGuard_base: import("@nestjs/passport", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/passport", { with: { "resolution-mode": "import" } }).IAuthGuard>;
export declare class GoogleCallbackGuard extends GoogleCallbackGuard_base {
    private readonly logger;
    handleRequest<TUser>(err: unknown, user: TUser, info: unknown): TUser;
}
export {};
