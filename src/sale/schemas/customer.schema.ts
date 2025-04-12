import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CustomerEmbedded {
  @Prop({ type: String, required: true })
  customerId: string;

  @Prop({ type: String, required: false })
  customerName?: string;

  @Prop({ type: String, required: false })
  nit?: string;
}

export const CustomerEmbeddedSchema = SchemaFactory.createForClass(CustomerEmbedded);
