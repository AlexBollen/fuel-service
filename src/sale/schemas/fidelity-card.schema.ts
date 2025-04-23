import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class FidelityCardEmbedded {
  @Prop({ type: String, required: true })
  fidelityCardId: string;

  @Prop({ type: Number, required: false })
  earnedPoints?: number;

  @Prop({ type: Number, required: false })
  lostPoints?: number;
}

export const FidelityCardEmbeddedSchema =
  SchemaFactory.createForClass(FidelityCardEmbedded);
