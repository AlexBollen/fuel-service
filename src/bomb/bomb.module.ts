import { Module, forwardRef } from '@nestjs/common';
import { BombService } from './bomb.service';
import { BombController } from './bomb.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bomb, BombSchema } from './schemas/bomb.schema';
import { SaleModule } from 'src/sale/sale.module';
import { Sale, SaleSchema } from 'src/sale/schemas/sale.schema';
import { BombGateway } from './bomb.gateway';

@Module({
  controllers: [BombController],
  providers: [BombService, BombGateway], //Add BombGateway as provider
  imports: [
    MongooseModule.forFeature([
      { name: Bomb.name, schema: BombSchema },
      { name: Sale.name, schema: SaleSchema },
    ]),
    forwardRef(() => SaleModule),     
  ],
  exports: [MongooseModule, BombService],
})
export class BombModule {}
