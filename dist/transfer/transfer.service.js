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
exports.TransferService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const transfer_entity_1 = require("./entities/transfer.entity");
const user_entity_1 = require("../users/entities/user.entity");
const sequelize_2 = require("sequelize");
let TransferService = class TransferService {
    transferModel;
    userModel;
    constructor(transferModel, userModel) {
        this.transferModel = transferModel;
        this.userModel = userModel;
    }
    async create(createTransferDto, senderId) {
        const receiver = await this.userModel.findByPk(createTransferDto.receiverId);
        if (!receiver) {
            throw new common_1.BadRequestException('El usuario receptor no existe');
        }
        const sender = await this.userModel.findByPk(senderId);
        if (!sender) {
            throw new common_1.UnauthorizedException('Usuario emisor no encontrado');
        }
        if (sender.balance < createTransferDto.amount) {
            throw new common_1.BadRequestException('Saldo insuficiente');
        }
        sender.balance -= createTransferDto.amount;
        receiver.balance += createTransferDto.amount;
        await sender.save();
        await receiver.save();
        const transfer = await this.transferModel.create({
            senderId: senderId,
            receiverId: createTransferDto.receiverId,
            amount: createTransferDto.amount,
            transactionDate: new Date(),
        });
        return transfer;
    }
    async findAll(userId) {
        return this.transferModel.findAll({
            where: {
                [sequelize_2.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            order: [['transactionDate', 'DESC']],
        });
    }
    async findOne(id, userId) {
        const transfer = await this.transferModel.findByPk(id);
        if (!transfer || (transfer.senderId !== userId && transfer.receiverId !== userId)) {
            throw new common_1.UnauthorizedException('No tienes acceso a esta transacción');
        }
        return transfer;
    }
};
exports.TransferService = TransferService;
exports.TransferService = TransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(transfer_entity_1.Transfer)),
    __param(1, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __metadata("design:paramtypes", [Object, Object])
], TransferService);
//# sourceMappingURL=transfer.service.js.map