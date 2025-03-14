import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FuelGasStationService } from './fuel-gas-station.service';
import { Fuel } from './schemas/fuel-gas-station.schema';

@Controller('fuelGasStation')
export class FuelGasStationController {
  constructor(private readonly fuelService: FuelGasStationService) {}

  @Post()
  async create(@Body() fuelData: Partial<Fuel>) {
    return this.fuelService.create(fuelData);
  }

  @Get()
  async findAll() {
    return this.fuelService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.fuelService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Fuel>) {
    return this.fuelService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.fuelService.delete(id);
  }
}
