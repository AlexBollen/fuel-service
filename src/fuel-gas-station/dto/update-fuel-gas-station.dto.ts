import { PartialType } from '@nestjs/mapped-types';
import { CreateFuelGasStationDto } from './create-fuel-gas-station.dto';

export class UpdateFuelGasStationDto extends PartialType(CreateFuelGasStationDto) {}
