import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PumpFuelDto {
  @ApiProperty({
    description: 'Cantidad servida',
    example: '32.25',
  })
  @IsNumber()
  servedQuantity?: number;

  @ApiProperty({
    description: 'Estado de la bomba',
    example: '1',
  })
  @IsNumber()
  status: number = 1;
}
