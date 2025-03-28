import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { Type } from 'class-transformer';

export class CreateFuelTypeDto {
  @ApiProperty({ description: 'Nombre del tipo de gasolina', example: 'Super' })
  @IsString()
  fuelName: string;

  @ApiProperty({ description: 'Costo por galón', example: 35.5 })
  @IsNumber()
  costPriceGalon: number;

  @ApiProperty({ description: 'Precio de venta por galón', example: 40.75 })
  @IsNumber()
  salePriceGalon: number;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    example: { employeeId: '123', employeeName: 'Juan Pérez' },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  createdBy: EmployeeEmbeddedDto;

  @ApiProperty({
    description: 'Empleado que actualizó el registro',
    example: { employeeId: '456', employeeName: 'Maria López' },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy?: EmployeeEmbeddedDto;

  @ApiProperty({ description: 'Estado del tipo de gasolina', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
