import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGeneralDepositDto } from './create-general-deposit.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateGeneralDepositDto extends PartialType(
  CreateGeneralDepositDto,
) {
  @ApiProperty({
    description: 'Id del depósito general',
    example: 'JD2IJ29SAD-SUPER',
  })
  @IsOptional()
  @IsUUID()
  idProducto?: string;

  @ApiProperty({
    description: 'Cantidad de compra para el depósito en galones',
    example: 500.0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  cantidad?: number;
}
