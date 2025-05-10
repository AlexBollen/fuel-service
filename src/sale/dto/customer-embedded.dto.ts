import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerEmbeddedDto {
  @ApiProperty({
    description: 'Id del cliente',
    example: 'XXXXX', 
  })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Fernando Rodríguez',
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Nit del cliente',
    example: '123456789',
  })
  @IsOptional()
  nit: string;
}
