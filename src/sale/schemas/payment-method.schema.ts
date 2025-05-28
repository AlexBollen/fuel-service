import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class PaymentMethodEmbedded {
  @Prop({ type: String, required: true })
  paymentId: number;

  @Prop({ type: String, required: false })
  method?: string;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const PaymentMethodEmbeddedSchema = SchemaFactory.createForClass(
  PaymentMethodEmbedded,
);
