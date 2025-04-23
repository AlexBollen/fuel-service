import { IsString, IsDecimal, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FuelEmbeddedDto {
  @ApiProperty({
    description: 'Id del tipo de combustible',
    example: 'DIESEL-1',
  })
  @IsString()
  fuelId: string;

  @ApiProperty({
    description: 'Nombre del tipo de combustible',
    example: 'Diésel',
  })
  @IsString()
  @IsOptional()
  fuelName?: string;

  @ApiProperty({
    description: 'Precio del combustible por galón',
    example: '27.09',
  })

  @IsOptional()
  @IsNumber()
  salePriceGalon?: number;
}

