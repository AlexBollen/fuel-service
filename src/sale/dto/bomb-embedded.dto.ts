import { IsString, IsNumber } from 'class-validator';
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