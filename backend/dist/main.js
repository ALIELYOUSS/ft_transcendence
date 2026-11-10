"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express_1 = require("express");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/uploads/posts', (0, express_1.static)((0, path_1.join)(process.cwd(), 'uploads', 'posts')));
    app.use('/uploads/avatars', (0, express_1.static)((0, path_1.join)(process.cwd(), 'uploads', 'avatars')));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('wemeet API')
        .setDescription('API documentation for the wemeet platform')
        .setVersion('0.1')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, swaggerDocument);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });
    app.use((0, cookie_parser_1.default)());
    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
//# sourceMappingURL=main.js.map