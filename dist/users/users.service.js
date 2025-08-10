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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createUserDto) {
        const existingUser = await this.userModel.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const accountNumber = this.generateAccountNumber();
        const user = await this.userModel.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
            accountNumber,
            balance: 0.0,
        });
        try {
            await this.sendWelcomeEmail(user.email, user.name, accountNumber);
        }
        catch (e) {
            console.error('Error enviando correo de bienvenida:', e.message);
        }
        const { password, ...result } = user.toJSON();
        return result;
    }
    async sendWelcomeEmail(email, name, accountNumber) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || 'tu-correo@gmail.com',
                pass: process.env.SMTP_PASS || 'tu-contraseña',
            },
        });
        await transporter.sendMail({
            from: 'Banco API <no-reply@banco.com>',
            to: email,
            subject: 'Bienvenido a Banco API',
            text: `Hola ${name}, tu cuenta ha sido creada exitosamente. Tu número de cuenta es: ${accountNumber}`,
        });
    }
    generateAccountNumber() {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    async login(loginUserDto) {
        try {
            if (!loginUserDto.email || !loginUserDto.password) {
                throw new common_1.BadRequestException('Email y contraseña son requeridos');
            }
            console.log('Buscando usuario con email:', loginUserDto.email);
            const user = await this.userModel.findOne({
                where: { email: loginUserDto.email }
            });
            if (!user) {
                console.log('Usuario no encontrado');
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            console.log('Usuario encontrado, verificando contraseña');
            const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
            if (!isMatch) {
                console.log('Contraseña incorrecta');
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            console.log('Contraseña correcta, generando token');
            const payload = {
                sub: user.id,
                email: user.email,
                name: user.name,
                accountNumber: user.accountNumber,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
                expiresIn: '1d',
            });
            const userData = user.toJSON();
            console.log('Login exitoso para el usuario:', userData.email);
            return {
                access_token: token,
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    accountNumber: userData.accountNumber,
                    balance: userData.balance,
                }
            };
        }
        catch (error) {
            console.error('Error en login:', error);
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new Error('Error inesperado en el proceso de login: ' + error.message);
        }
    }
    async findUserAuthenticated(userPayload) {
        const user = await this.userModel.findByPk(userPayload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const { password, ...result } = user.toJSON();
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_entity_1.User)),
    __metadata("design:paramtypes", [Object])
], UsersService);
//# sourceMappingURL=users.service.js.map