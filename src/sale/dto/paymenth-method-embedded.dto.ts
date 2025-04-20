import { IsString, Min, IsDecimal, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Id del método de pago',
    example: '', //Falta coordinar con pagos
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    description: 'Nombre del método de pago',
    example: 'Efectivo',
  })
  @IsString()
  @IsOptional()
  method?: string;

  
  @ApiProperty({
    description: 'Monto pagado con ese método de pago',
    example: '100.00',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  @IsString()
  amount: string;
}
