import { Module } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { FuelTypesController } from './fuel-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelTypeSchema, FuelType } from './schemas/fuel-type.schema';
import { Sale, SaleSchema } from 'src/sale/schemas/sale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FuelType.name, schema: FuelTypeSchema },
      { name: Sale.name, schema: SaleSchema },
    ]),
  ],
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
  exports: [FuelTypesService],
})
export class FuelTypesModule {}
