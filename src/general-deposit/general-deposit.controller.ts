import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { GeneralDepositService } from './general-deposit.service';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { CreateAlertDto } from "../alert/dto/create-alert.dto"
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
    description: 'Este endpoint lista un depósito general específico',
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

  @Patch('/update/:generalDepositId')
  @ApiOperation({
    summary: 'Editar una bomba',
    description: 'Este endpoint edita una bomba específica',
  })
  @ApiBody({ type: UpdateGeneralDepositDto })
  @ApiParam({
    name: 'generalDepositId',
    description: 'ID del depósito general a editar',
  })
  @ApiResponse({
    status: 200,
    description: 'Se actualizó correctamente correctamente el depósito general',
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
    return this.generalDepositService.update(id, updateGeneralDepositDto);
  }

  @Patch('/delete/:generalDepositId')
  @ApiOperation({
    summary: 'Eliminar una bomba',
    description:
      'Este endpoint elimina lógicamente un depósito general específica',
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
