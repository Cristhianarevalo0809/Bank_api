import { IsNotEmpty, IsNumber } from "class-validator";



export class CreateTransferDto {

    @IsNotEmpty()
    @IsNumber()
    receiverId: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

}
