import { IsNumber, ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
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
      example: 1000 ,
    })
    @IsNumber()
    @IsOptional()
    transactionNumber?: number;


    @ApiProperty({
      description: 'Número de autorización de la transacción',
      example: 'ABC-100' ,
    })
    @IsString()
    @IsOptional()
    authorizationNumber?: string;


    @ApiProperty({
      description: 'Número de factura',
      example: 'ABCD100ABCD' ,
    })
    @IsString()
    @IsOptional()
    billNumber?: string;

    @ApiProperty({
      description:
        'Id de la caja',
      example: 'ABCD1234',
    })
    @IsString()
    @IsOptional()
    cashRegisterId?: string;
}
