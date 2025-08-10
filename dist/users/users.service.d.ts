import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private userModel;
    constructor(userModel: typeof User);
    register(createUserDto: CreateUserDto): Promise<any>;
    sendWelcomeEmail(email: string, name: string, accountNumber: string): Promise<void>;
    private generateAccountNumber;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            accountNumber: any;
            balance: any;
        };
    }>;
    findUserAuthenticated(userPayload: any): Promise<any>;
}
