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

  @Prop({ type: Types.Decimal128, required: true })
  amount: Types.Decimal128;

  @Prop({ type: Types.Decimal128, required: true })
  consumedQuantity: Types.Decimal128;

  @Prop({ type: CustomerEmbedded, required: true })
  customer: CustomerEmbedded;

  @Prop({ type: BombEmbedded, required: true })
  bomb: BombEmbedded;

  @Prop({ type: FuelEmbedded, required: false })
  fuel: FuelEmbedded;

  @Prop({ type: [PaymentMethodEmbedded], required: false })
  paymentMethods: PaymentMethodEmbedded[];

  @Prop({ type: FidelityCardEmbedded, required: false })
  fidelityCard?: FidelityCardEmbedded;

  @Prop({ type: EmployeeEmbedded, required: true })
  createdBy: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  updatedBy?: EmployeeEmbedded;

  @Prop({ type: Number, required: true })
  status: number;
}

// Genera el esquema automáticamente y ya no se tiene que definir manualmente
export const SaleSchema = SchemaFactory.createForClass(Sale);
