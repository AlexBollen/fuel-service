import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class FidelityCardEmbedded {
  @Prop({ type: String, required: true })
  fidelityCardId: string;

  @Prop({ type: Types.Decimal128, required: true })
  earnedPoints: Types.Decimal128;

  @Prop({ type: Types.Decimal128, required: true })
  lostPoints: Types.Decimal128;
}

export const FidelityCardEmbeddedSchema =
  SchemaFactory.createForClass(FidelityCardEmbedded);
