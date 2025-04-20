import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class PaymentMethodEmbedded {
  @Prop({ type: String, required: true })
  paymentId: string;

  @Prop({ type: String, required: false })
  method?: string;

  @Prop({ type: Types.Decimal128, required: true })
  amount: Types.Decimal128;
}

export const PaymentMethodEmbeddedSchema = SchemaFactory.createForClass(
  PaymentMethodEmbedded,
);
