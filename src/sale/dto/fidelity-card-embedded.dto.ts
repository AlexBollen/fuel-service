import { IsString,  Min, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class FidelityCardEmbeddedDto{
    @ApiProperty({
        description: 'Id de la tarjeta de fidelidad',
        example: '123123123', //Coordinar con pagos
      })
    @IsString()
    fidelityCardId: string;
    
    @Min(0)
    @ApiProperty({
        description: 'Puntos ganados',
        example: '20',
      })
    @IsNumber()
    earnedPoints: number;

    @Min(0)
    @ApiProperty({
        description: 'Puntos perdidos/gastados',
        example: '20',
      })
    @IsNumber()
    lostPoint: number;
    
    }