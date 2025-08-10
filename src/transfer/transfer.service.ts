import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTransferDto } from './dto/create-transfer.dto';
  // Removed unnecessary UpdateTransferDto import
import { Transfer } from './entities/transfer.entity';
import { User } from '../users/entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfer)
    private transferModel: typeof Transfer,
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async create(createTransferDto: CreateTransferDto, senderId: number) {
    const receiver = await this.userModel.findByPk(createTransferDto.receiverId);
    if (!receiver) {
      throw new BadRequestException('El usuario receptor no existe');
    }

    const sender = await this.userModel.findByPk(senderId);
    if (!sender) {
      throw new UnauthorizedException('Usuario emisor no encontrado');
    }
    if (sender.balance < createTransferDto.amount) {
      throw new BadRequestException('Saldo insuficiente');
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

  async findAll(userId: number) {

    return this.transferModel.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      order: [['transactionDate', 'DESC']],
    });
  }

  async findOne(id: number, userId: number) {

    const transfer = await this.transferModel.findByPk(id);
    if (!transfer || (transfer.senderId !== userId && transfer.receiverId !== userId)) {
      throw new UnauthorizedException('No tienes acceso a esta transacción');
    }
    return transfer;
  }
}
