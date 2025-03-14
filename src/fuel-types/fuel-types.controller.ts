import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

@Controller('fuel-types')
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Post()
  create(@Body() createFuelTypeDto: CreateFuelTypeDto) {
    return this.fuelTypesService.create(createFuelTypeDto);
  }

  @Get()
  findAll() {
    return this.fuelTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuelTypeDto: UpdateFuelTypeDto) {
    return this.fuelTypesService.update(+id, updateFuelTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelTypesService.remove(+id);
  }
}
