import { Module } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { FuelTypesController } from './fuel-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelSchema, FuelType } from './schemas/fuelType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FuelType.name, schema: FuelSchema }]),
  ],
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
})
export class FuelTypesModule {}
