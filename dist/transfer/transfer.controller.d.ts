import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
export declare class TransferController {
    private readonly transferService;
    constructor(transferService: TransferService);
    create(createTransferDto: CreateTransferDto, req: any): Promise<import("./entities/transfer.entity").Transfer>;
    findAll(req: any): Promise<import("./entities/transfer.entity").Transfer[]>;
    findOne(id: string, req: any): Promise<import("./entities/transfer.entity").Transfer>;
}
