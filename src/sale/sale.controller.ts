import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import { Sale } from './schemas/sale.schema';

@ApiTags('Sales')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Crear una nueva venta',
    description: 'Este endpoint permite generar una nueva venta',
  })
  @ApiBody({ type: CreateSaleDto })
  @ApiResponse({
    status: 201,
    description: 'Venta generada correctamente',
    type: Sale,
  })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get('/list')
  @ApiOperation({
    summary: 'Obtener todas las ventas',
    description: 'Este endpoint devuelve todas las ventas',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de ventas',
    type: Sale,
  })
  findAll(): Promise<Sale[]> {
    return this.saleService.findAll();
  }

  @Get('/list/:saleId')
  @ApiOperation({
    summary: 'Obtener venta por ID',
    description: 'Este endpoint devuelve una venta específica',
  })
  @ApiParam({
    name: 'saleId',
    description: 'ID de la venta a encontrar',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada',
    type: Sale,
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  findOne(@Param('saleId') saleId: string): Promise<Sale> {
    return this.saleService.findOne(saleId);
  }

  @Patch('/update')
  @ApiOperation({
    summary: 'Editar una venta',
    description: 'Este endpoint edita una venta específica',
  })
  @ApiParam({
    name: 'saleId',
    description: 'ID de la venta a editar',
  })
 
  @ApiResponse({
    status: 200,
    description: 'Venta editada correctamente',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  update(@Param('saleId') saleId: string, @Body() updateSaleDto: UpdateSaleDto): Promise<Sale> {
    return this.saleService.update(saleId, updateSaleDto);
  }

  @Delete('/delete/:saleId')
  @ApiOperation({
    summary: 'Eliminar una venta',
    description: 'Este endpoint elimina lógicamente una venta específica',
  })
  @ApiParam({
    name: 'saleId',
    description: 'ID de la venta a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta eliminada correctamente',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  remove(@Param('saleId') saleId: string) {
    return this.saleService.remove(saleId);
  }
}
