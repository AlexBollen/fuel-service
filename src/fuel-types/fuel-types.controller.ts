import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FuelTypesService } from './fuel-types.service';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { FuelType } from './schemas/fuel-type.schema';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Fuel Types')
@Controller('fuel-types')
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de gasolina',
    description: 'Este endpoint permite crear un nuevo tipo de gasolina.',
  })
  @ApiBody({ type: CreateFuelTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Gasolina creada con éxito.',
    type: FuelType,
  })
  async create(
    @Body() createFuelTypeDto: CreateFuelTypeDto,
  ): Promise<FuelType> {
    return this.fuelTypesService.create(createFuelTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de gasolina activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de gasolina',
    type: [FuelType],
  })
  findAll(): Promise<FuelType[]> {
    return this.fuelTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de gasolina por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de gasolina' })
  @ApiResponse({
    status: 200,
    description: 'Gasolina encontrada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  findOne(@Param('id') id: string): Promise<FuelType> {
    return this.fuelTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de gasolina por ID' })
  @ApiParam({ name: 'id', description: 'ID del tipo de gasolina' })
  @ApiBody({ type: CreateFuelTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Gasolina actualizada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateFuelTypeDto: Partial<CreateFuelTypeDto>,
  ): Promise<FuelType> {
    return this.fuelTypesService.update(id, updateFuelTypeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar un tipo de gasolina por ID (Soft Delete)',
  })
  @ApiParam({ name: 'id', description: 'ID del tipo de gasolina' })
  @ApiResponse({
    status: 200,
    description: 'Gasolina desactivada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  remove(@Param('id') id: string): Promise<FuelType> {
    return this.fuelTypesService.remove(id);
  }
}
