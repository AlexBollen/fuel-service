import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EmployeeEmbeddedDto {
  @ApiProperty({
    description: 'ID del empleado',
    example: 'EMP123',
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Nombre del empleado',
    example: 'María Rojas',
  })
  @IsString()
  @IsOptional()
  employeeName: string;
}