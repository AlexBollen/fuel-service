import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelTypeDto } from './create-fuel-type.dto';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';
import { Type } from 'class-transformer';

export class UpdateFuelTypeDto extends PartialType(CreateFuelTypeDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbeddedDto)
  updatedBy?: EmployeeEmbedded;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
