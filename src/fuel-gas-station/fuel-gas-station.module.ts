import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Fuel, FuelSchema } from './schemas/fuel-gas-station.schema';
import { FuelGasStationService } from './fuel-gas-station.service';
import { FuelGasStationController } from './fuel-gas-station.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fuel.name, schema: FuelSchema }]),
  ],
  controllers: [FuelGasStationController],
  providers: [FuelGasStationService],
})
export class FuelGasStationModule {}
