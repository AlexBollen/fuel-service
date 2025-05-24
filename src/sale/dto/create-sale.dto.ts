import {
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
  IsIn,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodDto } from './paymenth-method-embedded.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { CustomerEmbeddedDto } from './customer-embedded.dto';
import { FuelEmbeddedDto } from './fuel-embedded.dto';
import { BombEmbeddedDto } from './bomb-embedded.dto';
import { FidelityCardEmbeddedDto } from './fidelity-card-embedded.dto';

export class CreateSaleDto {
  @ApiProperty({
    description: 'Determina que tipo de venta es',
    example: 1,
  })
  @IsNumber()
  @IsIn([1, 2])
  type: number;

  @ApiProperty({
    description: 'Total de la venta',
    example: 150.0,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Cantidad consumida',
    example: 3.35195530726257,
  })
  @IsNumber()
  @IsOptional()
  consumedQuantity?: number;

  @ApiProperty({
    type: CustomerEmbeddedDto,
    description: 'Datos del cliente',
    example: {
      customerId: 'XXXXXXXX',
      customerName: 'Fernando Rodríguez',
      nit: '123456789',
    },
  })
  @ValidateNested()
  @IsObject()
  @Type(() => CustomerEmbeddedDto)
  @IsOptional()
  customer?: CustomerEmbeddedDto;

  @ApiProperty({
    type: BombEmbeddedDto,
    description: 'Datos de la bomba que despachó el combustible',
    example: {
      bombId: 'c802afc9-a371-4dd0-a4d2-befdd992bbf3',
      bombNumber: 1,
    },
  })
  @ValidateNested()
  @IsObject()
  @Type(() => BombEmbeddedDto)
  bomb: BombEmbeddedDto;

  @ApiProperty({
    type: FuelEmbeddedDto,
    description: 'Datos del combustible que consumió el cliente',
    example: {
      fuelId: 'a5610883-cc68-4b51-b7f7-4f0ab86907bb',
      fuelName: 'Super',
      fuelPriceGalon: 44.75,
    },
  })
  @ValidateNested()
  @IsObject()
  @Type(() => FuelEmbeddedDto)
  fuel: FuelEmbeddedDto;

  @ApiProperty({
    type: PaymentMethodDto,
    description: 'Datos de los métodos de pago empleados en la transacción',
    example: {
      paymentId: 'XXXXXXXX',
      methood: 'Efectivo',
      amount: 150.0,
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  @IsOptional()
  paymentMethods?: PaymentMethodDto[];

  /*
  @ApiProperty({
    type: FidelityCardEmbeddedDto,
    description: 'Datos de la tarjeta de fidelidad',
    example: {
      fidelityCardId: '123123123',
      earnedPoints: '20',
      lostPoints: '20',
    },
  })
  @ValidateNested()
  @IsObject()
  @Type(() => FidelityCardEmbeddedDto)
  @IsOptional()
  fidelityCard?: FidelityCardEmbeddedDto;*/

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que genera la alerta',
    example: {
      employeeId: 'EMP123',
      employeeName: 'María Rojas',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  createdBy: EmployeeEmbeddedDto;

  @ApiProperty({
    description:
      'Estado de la venta (1 = activo, 2 = en proceso, 0 = cancelada',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  status?: number = 2;

  @ApiProperty({
    description: 'Id de la caja',
    example: 'ABCD1234',
  })
  @IsNumber()
  @IsOptional()
  cashRegisterId?: number;
}
