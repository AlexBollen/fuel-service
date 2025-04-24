import { Module } from '@nestjs/common';
import { BombService } from './bomb.service';
import { BombController } from './bomb.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bomb, BombSchema } from './schemas/bomb.schema';
import { EmployeeEmbeddedSchema } from 'src/sale/schemas/employee.schema';
import { Sale } from 'src/sale/schemas/sale.schema';
import { SaleModule } from 'src/sale/sale.module';
import { BombGateway } from './bomb.gateway';

@Module({
  controllers: [BombController],
  providers: [BombService, BombGateway], //Add BombGateway as provider
  imports: [
    MongooseModule.forFeature([
      { name: Bomb.name, schema: BombSchema },
      { name: Sale.name, schema: EmployeeEmbeddedSchema },
    ]),
    SaleModule,
  ],
  exports: [MongooseModule],
})
export class BombModule {}
