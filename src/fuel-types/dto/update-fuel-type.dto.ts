import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelTypeDto } from './create-fuel-type.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';

export class UpdateFuelTypeDto extends PartialType(CreateFuelTypeDto) {
  @IsOptional()
  updatedBy?: EmployeeEmbedded;

  @IsOptional()
  @IsBoolean()
  state?: boolean;
}
