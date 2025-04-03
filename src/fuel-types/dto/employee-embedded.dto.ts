import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeEmbeddedDto {
  @ApiProperty({ example: '123' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  employeeName: string;
}
