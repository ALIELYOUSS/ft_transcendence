declare const _default: (() => {
    clientId: string | undefined;
    clientSecret: string | undefined;
    callbackURL: string | undefined;
}) & import("@nestjs/config", { with: { "resolution-mode": "import" } }).ConfigFactoryKeyHost<{
    clientId: string | undefined;
    clientSecret: string | undefined;
    callbackURL: string | undefined;
}>;
export default _default;
