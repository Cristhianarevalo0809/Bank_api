import { Model } from 'sequelize-typescript';
export declare class Transfer extends Model {
    id: number;
    senderId: number;
    receiverId: number;
    amount: number;
    transactionDate: Date;
}
