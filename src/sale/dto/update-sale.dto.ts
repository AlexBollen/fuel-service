import { ValidateNested } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiProperty({
    type: EmployeeEmbeddedDto,
    description: 'Datos de empleado que edita la venta',
    example: {
      employeeId: 'EMP123',
      employeeName: 'María Rojas',
    },
  })
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy: EmployeeEmbeddedDto;
}
