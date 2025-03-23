import { Module } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { GeneralDepositController } from './general-deposit.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GeneralDeposit,
  GeneralDepositSchema,
} from './schemas/general-deposit.schema';
import { Sale } from 'src/sale/schemas/sale.schema';
import { FuelEmbeddedSchema } from 'src/sale/schemas/fuel.schema';
import { EmployeeEmbeddedSchema } from 'src/sale/schemas/employee.schema';

@Module({
  controllers: [GeneralDepositController],
  providers: [GeneralDepositService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneralDeposit.name, schema: GeneralDepositSchema },
      { name: Sale.name, schema: [FuelEmbeddedSchema, EmployeeEmbeddedSchema] },
    ]),
  ],
  exports: [MongooseModule],
})
export class GeneralDepositModule {}
