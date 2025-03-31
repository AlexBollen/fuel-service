import { IsString, IsDecimal } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


export class FuelEmbeddedDto{
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
    fuelName: string;
    
    @ApiProperty({
        description: 'Precio del combustible por galon',
        example: '27.09',
      })
    @IsDecimal()
    salePriceGalon: Types.Decimal128;
}