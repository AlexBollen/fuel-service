import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFuelGasStationDto {
  @IsString()
  @IsNotEmpty()
  fuelName: string;

  @IsNumber()
  costPriceGalon: number;

  @IsNumber()
  salePriceGalon: number;

  @IsString()
  createdByEmployeedId: string;

  @IsString()
  createdByEmployeeName: string;

  @IsBoolean()
  state: boolean;
}
