import { CreateTransferDto } from './dto/create-transfer.dto';
import { Transfer } from './entities/transfer.entity';
import { User } from '../users/entities/user.entity';
export declare class TransferService {
    private transferModel;
    private userModel;
    constructor(transferModel: typeof Transfer, userModel: typeof User);
    create(createTransferDto: CreateTransferDto, senderId: number): Promise<Transfer>;
    findAll(userId: number): Promise<Transfer[]>;
    findOne(id: number, userId: number): Promise<Transfer>;
}
