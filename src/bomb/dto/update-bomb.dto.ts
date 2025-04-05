import { PartialType } from '@nestjs/mapped-types';
import { CreateBombDto } from './create-bomb.dto';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeEmbeddedDto } from 'src/alert/dto/employee-embedded.dto';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateBombDto extends PartialType(CreateBombDto) {
  @ApiProperty({
    description: 'Número de bomba',
    example: 1,
  })
  @IsNumber()
  bombNumber: number;

  @ApiPropertyOptional({
    description: 'Cantidad servida',
    example: 40.23,
  })
  @IsOptional()
  @IsNumber()
  servedQuantity?: number;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Empleado a cargo al actualizar la bomba',
    example: {
      employeeId: 'EMP121',
      employeeName: 'Maria Rojas',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  employeeInCharge: EmployeeEmbeddedDto;

  @ApiPropertyOptional({
    description: 'Fecha y hora de la última actualización',
    example: '2024-04-04 12:34:56',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  @ApiPropertyOptional({
    type: EmployeeEmbeddedDto,
    description: 'Empleado que actualizó la bomba',
    example: {
      employeeId: 'EMP122',
      employeeName: 'Carlos Díaz',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy?: EmployeeEmbeddedDto;

  @ApiPropertyOptional({
    description: 'Estado de la bomba',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}
