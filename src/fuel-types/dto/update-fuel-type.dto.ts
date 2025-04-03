import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFuelTypeDto } from './create-fuel-type.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { Type } from 'class-transformer';

export class UpdateFuelTypeDto extends PartialType(CreateFuelTypeDto) {
  @ApiPropertyOptional({
    description: 'Nombre del tipo de gasolina',
    example: 'Super',
  })
  @IsOptional()
  fuelName?: string;

  @ApiPropertyOptional({ description: 'Costo por galón', example: 35.5 })
  @IsOptional()
  costPriceGalon?: number;

  @ApiPropertyOptional({
    description: 'Precio de venta por galón',
    example: 40.75,
  })
  @IsOptional()
  salePriceGalon?: number;

  @ApiPropertyOptional({
    type: EmployeeEmbeddedDto,
    example: { employeeId: '456', employeeName: 'Maria López' },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy?: EmployeeEmbeddedDto;
}
