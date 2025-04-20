import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './schemas/alert.schema';

import { Sale, SaleSchema } from 'src/sale/schemas/sale.schema';
import { SaleModule } from 'src/sale/sale.module';

@Module({
  controllers: [AlertController],
  providers: [AlertService],
  imports: [
    MongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: Sale.name, schema: SaleSchema },
    ]),
    SaleModule,
  ],
  exports: [MongooseModule],
})
export class AlertModule {}
