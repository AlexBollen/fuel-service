import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CustomerEmbedded } from './customer.schema';
import { BombEmbedded } from './bomb.schema';
import { FuelEmbedded } from './fuel.schema';
import { PaymentMethodEmbedded } from './payment-method.schema';
import { FidelityCardEmbedded } from './fidelity-card.schema';
import { EmployeeEmbedded } from './employee.schema';

// HydratedDocument le da funciones y métodos adicionales a Sale como .save() y .populate()
// También permite usar el SaleDocuement en otras partes del código para tener autocompletado y validaciones de TypeScript.
export type SaleDocument = HydratedDocument<Sale>;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: String, required: true })
  fuelSaleId: string;

  @Prop({ type: Number, required: false })
  amount?: number;

  @Prop({ type: Number, required: false })
  maxTime?: number; // maxium time that the system allows to finish the sale

  @Prop({ type: Number, required: false })
  totalTime?: number; // total time that arduino tooks

  @Prop({ type: Number, required: false })
  consumedQuantity?: number;

  @Prop({ type: CustomerEmbedded, required: false })
  customer?: CustomerEmbedded;

  @Prop({ type: BombEmbedded, required: true })
  bomb: BombEmbedded;

  @Prop({ type: FuelEmbedded, required: true })
  fuel: FuelEmbedded;

  @Prop({ type: [PaymentMethodEmbedded], required: false })
  paymentMethods?: PaymentMethodEmbedded[];

  /*
  @Prop({ type: FidelityCardEmbedded, required: false })
  fidelityCard?: FidelityCardEmbedded;*/

  @Prop({ type: EmployeeEmbedded, required: true })
  createdBy: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  updatedBy?: EmployeeEmbedded;

  @Prop({ type: Number, required: false })
  status?: number;

  @Prop({ type: String, required: false })
  transactionId?: string;

  @Prop({ type: Number, required: false })
  transactionNumber?: number;

  @Prop({ type: String, required: false })
  authorizationNumber?: string;

  @Prop({ type: String, required: false })
  billNumber?: string;

  @Prop({ type: String, required: false })
  paymentServiceMessage?: string;

}

// Genera el esquema automáticamente y ya no se tiene que definir manualmente
export const SaleSchema = SchemaFactory.createForClass(Sale);
