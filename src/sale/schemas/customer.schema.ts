import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CustomerEmbedded {
  @Prop({ type: String, required: true })
  customerId: string;

  @Prop({ type: String, required: true })
  customerName: string;

  @Prop({ type: String, required: true })
  nit: string;
}

export const CustomerEmbeddedSchema = SchemaFactory.createForClass(CustomerEmbedded);
