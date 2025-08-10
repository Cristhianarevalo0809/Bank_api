import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<any>;
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
    findUserAuthenticated(req: any): Promise<any>;
}
