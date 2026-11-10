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
exports.SlotsController = void 0;
const common_1 = require("@nestjs/common");
const slots_service_1 = require("./slots.service");
const create_slot_dto_1 = require("./dto/create-slot.dto");
const update_slot_dto_1 = require("./dto/update-slot.dto");
let SlotsController = class SlotsController {
    slotsService;
    constructor(slotsService) {
        this.slotsService = slotsService;
    }
    create(createSlotDto) {
        return this.slotsService.create(createSlotDto);
    }
    findAll() {
        return this.slotsService.findAll();
    }
    findOne(id) {
        return this.slotsService.findOne(+id);
    }
    update(id, updateSlotDto) {
        return this.slotsService.update(+id, updateSlotDto);
    }
    remove(id) {
        return this.slotsService.remove(+id);
    }
};
exports.SlotsController = SlotsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slot_dto_1.CreateSlotDto]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_slot_dto_1.UpdateSlotDto]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlotsController.prototype, "remove", null);
exports.SlotsController = SlotsController = __decorate([
    (0, common_1.Controller)('slots'),
    __metadata("design:paramtypes", [slots_service_1.SlotsService])
], SlotsController);
//# sourceMappingURL=slots.controller.js.map