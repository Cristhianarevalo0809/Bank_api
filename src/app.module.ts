import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './config/config.module';

@Module({
  imports: [
    ConfigurationModule,
    TransferModule, 
    UsersModule, 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadModels: true,
    synchronize: true,
    //sync: { force: true }, // Esto recreará las tablas
        dialectOptions: {
          ssl: configService.get('database.ssl'),
        }
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
