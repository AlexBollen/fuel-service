import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { Type } from 'class-transformer';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Mensaje de la alerta',
    example: 'Aviso de combustible tipo SUPER bajo',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Módulo de destino',
    example: 'Administración',
  })
  @IsString()
  destination: string;

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

  @ApiProperty({ description: 'Estado de la alerta', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}
