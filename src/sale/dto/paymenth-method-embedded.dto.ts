import { IsString, Min, IsDecimal, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Id del método de pago, del 1 al 5',
    example: 1, 
  })
  @IsNumber()
  paymentId: number;

  @ApiProperty({
    description: 'Nombre del método de pago',
    example: 'Efectivo',
  })
  @IsString()
  @IsOptional()
  method?: string;

  
  @ApiProperty({
    description: 'Monto pagado con ese método de pago',
    example: 100.00,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Id del banco',
    example: 'ID', 
  })
  @IsString()
  @IsOptional()
  bankId?: string;

  @ApiProperty({
    description: 'No de la tarjeta (en el caso que aplique su uso)',
    example: 'XXXXXXX123', 
  })
  @IsString()
  @IsOptional()
  cardNumber?: string;
  
}
