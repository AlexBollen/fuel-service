import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationMongo } from './configuration/configuration-mongo';
import { FuelTypesModule } from './fuel-types/fuel-types.module';
import { GeneralDepositModule } from './general-deposit/general-deposit.module';
import { SaleModule } from './sale/sale.module';
import { BombModule } from './bomb/bomb.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationMongo],
      envFilePath: `.env`, //archivo para variables de entorno
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongo.MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    FuelTypesModule,
    GeneralDepositModule,
    SaleModule,
    BombModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
