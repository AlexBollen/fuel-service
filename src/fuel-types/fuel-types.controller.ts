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
@Controller('fuelType')
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Post('/create')
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

  @Get('/list')
  @ApiOperation({ summary: 'Obtener todos los tipos de gasolina activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de gasolina',
    type: [FuelType],
  })
  findAll(): Promise<FuelType[]> {
    return this.fuelTypesService.findAll();
  }

  @Get('/list/:fuelId')
  @ApiOperation({ summary: 'Obtener un tipo de gasolina por ID' })
  @ApiParam({ name: 'fuelId', description: 'ID del tipo de gasolina' })
  @ApiResponse({
    status: 200,
    description: 'Gasolina encontrada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  findOne(@Param('fuelId') fuelId: string): Promise<FuelType> {
    return this.fuelTypesService.findOne(fuelId);
  }

  @Patch('/update/:fuelId')
  @ApiOperation({ summary: 'Actualizar un tipo de gasolina por ID' })
  @ApiParam({ name: 'fuelId', description: 'ID del tipo de gasolina' })
  @ApiBody({ type: CreateFuelTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Gasolina actualizada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  update(
    @Param('fuelId') fuelId: string,
    @Body() updateFuelTypeDto: Partial<CreateFuelTypeDto>,
  ): Promise<FuelType> {
    return this.fuelTypesService.update(fuelId, updateFuelTypeDto);
  }

  @Delete('/delete/:fuelId')
  @ApiOperation({
    summary: 'Desactivar un tipo de gasolina por ID (Soft Delete)',
  })
  @ApiParam({ name: 'fuelId', description: 'ID del tipo de gasolina' })
  @ApiResponse({
    status: 200,
    description: 'Gasolina desactivada',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Gasolina no encontrada' })
  remove(@Param('fuelId') fuelId: string): Promise<FuelType> {
    return this.fuelTypesService.remove(fuelId);
  }
}
