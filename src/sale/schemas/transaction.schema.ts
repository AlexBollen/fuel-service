import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class TransactionEmbedded {
  @Prop({ type: String, required: false })
  transactionIs?: string;

  @Prop({ type: String, required: false })
  noBill?: string;

}

export const FuelEmbeddedSchema = SchemaFactory.createForClass(TransactionEmbedded);
