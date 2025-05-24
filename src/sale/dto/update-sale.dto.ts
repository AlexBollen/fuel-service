import { IsNumber, ValidateNested, IsIn, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({
    description: 'Determina que tipo de venta es',
    example: 1,
  })
  @IsNumber()
  @IsIn([1, 2])
  type: number;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que edita la venta',
    example: {
      employeeId: 'EMP123',
      employeeName: 'María Rojas',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy: EmployeeEmbeddedDto;

  @ApiProperty({
    description: 'Id de la transacción',
    example: 'UUID',
  })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({
    description: 'Número de la transacción',
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  transactionNumber?: number;

  @ApiProperty({
    description: 'Número de autorización de la transacción',
    example: 'ABC-100',
  })
  @IsString()
  @IsOptional()
  authorizationNumber?: string;

  @ApiProperty({
    description: 'Número de factura',
    example: 'ABCD100ABCD',
  })
  @IsString()
  @IsOptional()
  billNumber?: string;

  @ApiProperty({
    description:
      'Tiempo en milisegundos que duró la bomba despachando combustible',
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  totalTime?: Number;


  @ApiProperty({
    description: 'Mensaje del servicio de pagos',
    example: 'Metodo de pago no valido',
  })
  @IsString()
  @IsOptional()
  paymentServiceMessage?: string;
}
