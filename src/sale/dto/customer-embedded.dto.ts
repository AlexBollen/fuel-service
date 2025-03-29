import { IsString, IsInt, Min, IsPositive, ValidateNested, IsArray, IsNumber, isDecimal, IsDecimal, IsObject, isArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodDto } from './paymenth-method-embedded.dto';
import { EmployeeEmbeddedDto } from './employee-embedded.dto';

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