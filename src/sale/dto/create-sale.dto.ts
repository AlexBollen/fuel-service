import {
  IsString,
  ValidateNested,
  IsArray,
  IsNumber,
  IsDecimal,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodDto } from './paymenth-method-embedded.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { CustomerEmbeddedDto } from './customer-embedded.dto';
import { FuelEmbeddedDto } from './fuel-embedded.dto';
import { BombEmbeddedDto } from './bomb-embedded.dto';
import { FidelityCardEmbeddedDto } from './fidelity-card-embedded.dto';

export class CreateSaleDto {
  
  @ApiProperty({
    description: 'Total de la venta',
    example: '100.00',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  @IsString()
  @IsOptional()
  amount?: string;

  @ApiProperty({
    description: 'Cantidad consumida',
    example: '5.0',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  @IsString()
  @IsOptional()
  consumedQuantity?: string;

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
      bombId: 'BOMB-1',
      bombNumber: '1',
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
      fuelId: 'DIESEL-1',
      fuelName: 'Diésel',
      fuelPriceGalon: '27.09',
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
      amount: '100.00',
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  @IsOptional()
  paymentMethods: PaymentMethodDto[];

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
  fidelityCard?: FidelityCardEmbeddedDto;

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
}
