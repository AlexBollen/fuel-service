import { IsNumber, IsIn } from 'class-validator';

export class UpdateBombStatusDto {
  @IsNumber()
  @IsIn([0, 1, 2, 3, 4]) // Only 0 or 1 are valid values
  status: number;
}
