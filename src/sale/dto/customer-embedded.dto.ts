import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CustomerEmbeddedDto{

    @ApiProperty({
        description: 'Id del cliente',
        example: 'XXXXX', //Coordinar con pagos y administración
      })
    @IsString()
    customerId: string

    @ApiProperty({
        description: 'Nombre del cliente',
        example: 'Fernando Rodríguez',
      })
    @IsString()
    customerName: string


    @ApiProperty({
        description: 'Nit del cliente',
        example: '123456789',
      })
    @IsString()
    nit: string
}