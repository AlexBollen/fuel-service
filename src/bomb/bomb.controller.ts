import { Controller, Get, Post, Body, Put, Param, Patch } from '@nestjs/common';
import { BombService } from './bomb.service';
import { CreateBombDto } from './dto/create-bomb.dto';
import { UpdateBombDto } from './dto/update-bomb.dto';
import { Bomb } from './schemas/bomb.schema';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Alert } from 'src/alert/schemas/alert.schema';

@ApiTags('Bombs')
@Controller('bomb')
export class BombController {
  constructor(private readonly bombService: BombService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva bomba',
    description: 'Este endpoint permite crear una nueva bomba',
  })
  @ApiBody({ type: CreateBombDto })
  @ApiResponse({
    status: 201,
    description: 'Bomba creada correctamente',
    type: Bomb,
  })
  async create(@Body() createBombDto: CreateBombDto): Promise<Bomb> {
    return this.bombService.create(createBombDto);
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Obtener todas las bombas',
    description: 'Este endpoint devuelve todas las bombas que estan activas',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de bombas',
    type: [Bomb],
  })
  findAll(): Promise<Bomb[]> {
    return this.bombService.findAll();
  }

  @Get('/list/:bombId')
  @ApiOperation({
    summary: 'Obtener una bomba por ID',
    description: 'Este endpoint lista una bomba específica',
  })
  @ApiParam({
    name: 'bombId',
    description: 'ID de la bomba a encontrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Bomba encontrada',
    type: Bomb,
  })
  @ApiResponse({
    status: 404,
    description: 'Bomba no encontrada',
  })
  findOne(@Param('bombId') bombId: string): Promise<Bomb> {
    return this.bombService.findOne(bombId);
  }

  @Patch('/update/:bombId')
  @ApiOperation({
    summary: 'Editar una bomba',
    description: 'Este endpoint edita una bomba específica',
  })
  @ApiParam({
    name: 'bombId',
    description: 'ID de la bomba a editar',
  })
  @ApiResponse({
    status: 200,
    description: 'Bomba editada correctamente',
    type: Bomb,
  })
  @ApiResponse({
    status: 404,
    description: 'Bomba no encontrada',
  })
  update(@Param('bombId') bombId: string, @Body() updateBombDto: UpdateBombDto) {
    return this.bombService.update(bombId, updateBombDto);
  }

  @Patch('/delete/:bombId')
  @ApiOperation({
    summary: 'Eliminar una bomba',
    description: 'Este endpoint elimina lógicamente una bomba específica',
  })
  @ApiParam({
    name: 'bombId',
    description: 'ID de la bomba a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Bomba eliminada correctamente',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Bomba no encontrada',
  })
  remove(@Param('bombId') bombId: string) {
    return this.bombService.remove(bombId);
  }
}
