import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelTypesController } from '../fuel-types.controller';
import { FuelTypesService } from '../fuel-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FuelType.name, schema: FuelType }]),
  ],
  controllers: [FuelTypesController],
  providers: [FuelTypesService],
})
export class FuelType {}
