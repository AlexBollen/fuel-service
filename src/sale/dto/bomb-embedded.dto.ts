import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BombEmbeddedDto {
  @ApiProperty({
    description: 'Id de la bomba de combustible',
    example: 'c802afc9-a371-4dd0-a4d2-befdd992bbf3',
  })
  @IsString()
  bombId: string;

  @ApiProperty({
    description: 'Número de la bomba',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  bombNumber?: number;
}
