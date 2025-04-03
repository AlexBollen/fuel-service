import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
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
}
