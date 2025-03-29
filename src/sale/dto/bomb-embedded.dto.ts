import { IsString, IsInt, Min, IsPositive, ValidateNested, IsArray, IsNumber, isDecimal, IsDecimal, IsObject, isArray, IsOptional, isNumber } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


export class BombEmbeddedDto{
    @ApiProperty({
        description: 'Id de la bomba de combustible',
        example: 'BOMB-123', 
      })
    @IsString()
    bombId: string;
    
    @ApiProperty({
        description: 'Número de la bomba',
        example: '1',
      })
    @IsNumber()
    bombNumber: number;
    
    }