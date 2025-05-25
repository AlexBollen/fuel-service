import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { CreateAlertDto } from '../alert/dto/create-alert.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GeneralDeposit } from './schemas/general-deposit.schema';

@ApiTags('General Deposits')
@Controller('general-deposit')
export class GeneralDepositController {
  constructor(private readonly generalDepositService: GeneralDepositService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Crear un nuevo depósito general',
    description:
      'Este endpoint permite crear un nuevo depósito general de combustible',
  })
  @ApiBody({ type: CreateGeneralDepositDto })
  @ApiResponse({
    status: 201,
    description: 'Depósito creada correctamente',
    type: GeneralDeposit,
  })
  create(@Body() createGeneralDepositDto: CreateGeneralDepositDto) {
    return this.generalDepositService.create(createGeneralDepositDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los depósitos generales',
    description:
      'Este endpoint devuelve todos los depósitos generales que estan activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de depósitos generales',
    type: [GeneralDeposit],
  })
  @Get('/list')
  findAll() {
    return this.generalDepositService.findAll();
  }

  @Get('/list/:generalDepositId')
  @ApiOperation({
    summary: 'Obtener un depósito general por ID',
    description: 'Este endpoint retorna un depósito general específico',
  })
  @ApiParam({
    name: 'generalDepositId',
    description: 'ID del depósito general a encontrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Depósito general encontrado',
    type: GeneralDeposit,
  })
  @ApiResponse({
    status: 404,
    description: 'Depósito general no encontrado',
  })
  findOne(@Param('generalDepositId') id: string) {
    return this.generalDepositService.findOne(id);
  }

  @Get('/list/fuel/:fuelId')
  @ApiOperation({
    summary: 'Obtener un depósito general por ID de tipo de combustible',
    description:
      'Este endpoint lista un depósito general específico en base al tipo de combustible asignado',
  })
  @ApiParam({
    name: 'fuelId',
    description: 'ID del combustible de depósito general a encontrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Depósito general encontrado',
    type: GeneralDeposit,
  })
  @ApiResponse({
    status: 404,
    description: 'Depósito general no encontrado',
  })
  findByFuelType(@Param('fuelId') id: string) {
    return this.generalDepositService.findByFuelType(id);
  }

  @Get('/currentTimeCapacity/:fuelId')
  @ApiOperation({
    summary:
      'Obtener tiempo estimado de capacidad actual por tipo de combustible',
    description:
      'Este endpoint calcula y retorna el tiempo de capacidad actual para un tipo de combustible específico',
  })
  @ApiParam({
    name: 'fuelId',
    description: 'ID del tipo de combustible',
  })
  @ApiResponse({
    status: 200,
    description: 'Tiempo estimado calculado correctamente',
    schema: {
      example: {
        currentCapacityTime: 150000,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'No se encontró el depósito para el tipo de combustible proporcionado',
  })
  async getCurrentCapacityTimeByFuelId(
    @Param('fuelId') fuelId: string,
  ): Promise<{ currentCapacityTime: number }> {
    return this.generalDepositService.getCurrentCapacityTimeByFuelId(fuelId);
  }

  @Patch('/update/:generalDepositId')
  @ApiOperation({
    summary: 'Editar un depósito general',
    description: 'Este endpoint edita un depósito de combustible específico',
  })
  @ApiBody({ type: UpdateGeneralDepositDto })
  @ApiParam({
    name: 'generalDepositId',
    description: 'ID del depósito general a editar',
  })
  @ApiResponse({
    status: 200,
    description: 'Se actualizó correctamente el depósito general',
    type: GeneralDeposit,
  })
  @ApiResponse({
    status: 404,
    description: 'Depósito general no encontrado',
  })
  update(
    @Param('generalDepositId') id: string,
    @Body() updateGeneralDepositDto: UpdateGeneralDepositDto,
  ) {
    return this.generalDepositService.update(updateGeneralDepositDto, id);
  }

  @Post('/update/supply')
  @ApiOperation({
    summary: 'Reabastecer un depósito general',
    description:
      'Endpoint específico para servicio de administración para reabastecer un depósito de combustible específico',
  })
  @ApiBody({ type: UpdateGeneralDepositDto })
  @ApiResponse({
    status: 200,
    description: 'Se reabasteció correctamente el depósito general',
    type: GeneralDeposit,
  })
  @ApiResponse({
    status: 404,
    description: 'Depósito general no encontrado',
  })
  supply(@Body() updateGeneralDepositDto: UpdateGeneralDepositDto) {
    return this.generalDepositService.update(updateGeneralDepositDto);
  }

  @Patch('/delete/:generalDepositId')
  @ApiOperation({
    summary: 'Eliminar un depósito general',
    description:
      'Este endpoint elimina lógicamente un depósito general específico',
  })
  @ApiParam({
    name: 'generalDepositId',
    description: 'ID del depósito general a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Depósito general eliminado correctamente',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Depósito general no encontrado',
  })
  remove(@Param('generalDepositId') id: string) {
    return this.generalDepositService.remove(id);
  }
}
