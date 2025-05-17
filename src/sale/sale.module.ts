import { Module, forwardRef } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BombModule } from 'src/bomb/bomb.module';
import { FuelTypesModule } from 'src/fuel-types/fuel-types.module';
import { GeneralDepositModule } from 'src/general-deposit/general-deposit.module';
import { AlertModule } from 'src/alert/alert.module';
import { BombGateway } from 'src/bomb/bomb.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    forwardRef(() => BombModule),
    forwardRef(() => FuelTypesModule),
    GeneralDepositModule,
    forwardRef(() => AlertModule),
  ],
  controllers: [SaleController],
  providers: [SaleService, BombGateway],
  exports: [MongooseModule, SaleService],
})
export class SaleModule {}
