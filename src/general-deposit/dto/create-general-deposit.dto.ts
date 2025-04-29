import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeEmbeddedDto } from 'src/sale/dto/employee-embedded.dto';
import { FuelEmbeddedDto } from 'src/sale/dto/fuel-embedded.dto';

export class CreateGeneralDepositDto {
  @ApiProperty({
    description: 'Capacidad máxima del depósito en galones',
    example: '1000',
  })
  @IsNotEmpty()
  @IsNumber()
  maxCapacity: number;

  @ApiProperty({
    description: 'Capacidad actual del depósito en galones',
    example: '700',
  })
  @IsNotEmpty()
  @IsNumber()
  currentCapacity: number;

  @ApiProperty({
    type: FuelEmbeddedDto,
    description: 'Datos del tipo de combustible del depósito',
    example: {
      fuelId: 'DIESEL-1',
      fuelName: 'Diésel',
      salePriceGalon: '27.09',
    },
  })
  @ValidateNested()
  @Type(() => FuelEmbeddedDto)
  fuel: FuelEmbeddedDto;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que crea el depósito general',
    example: {
      employeeId: 'EMP121',
      employeeName: 'Santiago López',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  createdBy?: EmployeeEmbeddedDto;

  @ApiProperty({ description: 'Estado del depósito general', example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean = true;
}
