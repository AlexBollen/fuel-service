import { Module } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { GeneralDepositController } from './general-deposit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeneralDeposit,
  GeneralDepositSchema,
} from './schemas/general-deposit.schema';
import { Sale, SaleSchema } from 'src/sale/schemas/sale.schema';


@Module({
  controllers: [GeneralDepositController],
  providers: [GeneralDepositService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneralDeposit.name, schema: GeneralDepositSchema },
      { name: Sale.name, schema: SaleSchema },
      
    ]),
  ],
  exports: [MongooseModule, GeneralDepositService],
})
export class GeneralDepositModule {}
