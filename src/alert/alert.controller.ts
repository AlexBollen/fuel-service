import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Alert } from './schemas/alert.schema';

@ApiTags('Alerts')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Crear una nueva alerta',
    description: 'Este endpoint permite generar una nueva alerta',
  })
  @ApiBody({ type: CreateAlertDto })
  @ApiResponse({
    status: 201,
    description: 'Alerta creada correctamente',
    type: Alert,
  })
  async create(@Body() createAlertDto: CreateAlertDto): Promise<Alert> {
    return this.alertService.create(createAlertDto);
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Obtener todas las alertas',
    description: 'Este endpoint devuelve todas las alertas activas',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de alertas',
    type: [Alert],
  })
  findAll(): Promise<Alert[]> {
    return this.alertService.findAll();
  }

  @Get('/list/:alertId')
  @ApiOperation({
    summary: 'Obtener una alerta por ID',
    description: 'Este endpoint devuelve una alerta específica',
  })
  @ApiParam({
    name: 'alertId',
    description: 'ID de la alerta a encontrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerta encontrada',
    type: Alert,
  })
  @ApiResponse({
    status: 404,
    description: 'Alerta no encontrada',
  })
  findOne(@Param('alertId') alertId: string): Promise<Alert> {
    return this.alertService.findOne(alertId);
  }

  @Patch('/delete/:alertId')
  @ApiOperation({
    summary: 'Eliminar una alerta',
    description: 'Este endpoint elimina lógicamente una alerta específica',
  })
  @ApiParam({
    name: 'alertId',
    description: 'ID de la alerta a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Alerta eliminada correctamente',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Alerta no encontrada',
  })
  remove(@Param('alertId') alertId: string) {
    return this.alertService.remove(alertId);
  }
}
