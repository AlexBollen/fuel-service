import { PartialType } from '@nestjs/mapped-types';
import { CreateBombDto } from './create-bomb.dto';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';

export class UpdateBombDto extends PartialType(CreateBombDto) {
  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeEmbedded)
  updatedBy?: EmployeeEmbedded;

  @IsOptional()
  @IsNumber()
  state?: number;    
}
