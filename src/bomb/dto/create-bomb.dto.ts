import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EmployeeEmbeddedDto } from 'src/alert/dto/employee-embedded.dto';
import {
    IsNumber,
    IsOptional,
    ValidateNested,
  } from 'class-validator';

export class CreateBombDto {
  @ApiProperty({
    description: 'Número de bomba',
    example: '2',
  })
  @IsNumber()
  bombNumber: number;

  @ApiProperty({
    description: 'Cantidad servida',
    example: '32.25',
  })
  @IsNumber()
  servedQuantity: number;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que esta a cargo de la bomba',
    example: {
      employeeId: 'EMP121',
      employeeName: 'Samuel Reyes',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  employeeInCharge: EmployeeEmbeddedDto;

  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que crea la bomba',
    example: {
      employeeId: 'EMP123',
      employeeName: 'María Rojas',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  createdBy: EmployeeEmbeddedDto;

  @ApiProperty({
    description: 'Estado de la bomba', 
    example:  '1'
})
  @IsNumber()
  @IsOptional()
  status?: number = 1;

  @ApiProperty({
    description: 'Empleado que actualizó la bomba',
    example: { 
        employeeId: 'EMP154', 
        employeeName: 'Alex Bollen' },
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy?: EmployeeEmbeddedDto;
}
