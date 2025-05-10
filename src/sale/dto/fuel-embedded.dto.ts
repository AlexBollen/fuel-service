import { IsString, IsDecimal, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FuelEmbeddedDto {
  @ApiProperty({
    description: 'Id del tipo de combustible',
    example: 'a5610883-cc68-4b51-b7f7-4f0ab86907bb',
  })
  @IsString()
  fuelId: string;

  @ApiProperty({
    description: 'Nombre del tipo de combustible',
    example: 'Super',
  })
  @IsString()
  @IsOptional()
  fuelName?: string;

  @ApiProperty({
    description: 'Precio del combustible por galón',
    example: 44.75,
  })

  @IsOptional()
  @IsNumber()
  salePriceGalon?: number;
}

