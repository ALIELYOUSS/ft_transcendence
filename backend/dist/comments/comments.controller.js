"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const comments_service_1 = require("./comments.service");
const guards_1 = require("../auth/Guards/guards");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    findAll(postId) {
        return this.commentsService.findAll(postId);
    }
    create(postId, content, request) {
        if (!content || !content.trim()) {
            throw new common_1.BadRequestException('Comment content is required');
        }
        return this.commentsService.create(postId, content, request.user.sub);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                content: {
                    type: 'string',
                    example: 'Amazing photo!',
                },
            },
            required: ['content'],
        },
    }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "create", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('posts/:postId/comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map