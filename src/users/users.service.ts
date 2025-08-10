import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
  // Removed unnecessary UpdateUserDto import
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async register(createUserDto: CreateUserDto) {

    const existingUser = await this.userModel.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
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
    } catch (e) {
      console.error('Error enviando correo de bienvenida:', e.message);
    }


    const { password, ...result } = user.toJSON();
    return result;
  }

  async sendWelcomeEmail(email: string, name: string, accountNumber: string) {

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

  private generateAccountNumber(): string {

    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      // Validar que recibimos los datos
      if (!loginUserDto.email || !loginUserDto.password) {
        throw new BadRequestException('Email y contraseña son requeridos');
      }

      console.log('Buscando usuario con email:', loginUserDto.email);
      
      const user = await this.userModel.findOne({ 
        where: { email: loginUserDto.email }
      });

      if (!user) {
        console.log('Usuario no encontrado');
        throw new UnauthorizedException('Credenciales inválidas');
      }

      console.log('Usuario encontrado, verificando contraseña');

      const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
      if (!isMatch) {
        console.log('Contraseña incorrecta');
        throw new UnauthorizedException('Credenciales inválidas');
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
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Error inesperado en el proceso de login: ' + error.message);
    }
  }

  async findUserAuthenticated(userPayload: any) {

    const user = await this.userModel.findByPk(userPayload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const { password, ...result } = user.toJSON();
    return result;
  }
}
