import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
  employeeName: string;
}