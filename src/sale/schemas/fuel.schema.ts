import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class FuelEmbedded {
  @Prop({ type: String, required: true })
  fuelId: string;

  @Prop({ type: String, required: false })
  fuelName?: string;

  @Prop({ type: Number, required: false })
  salePriceGalon?: number;
}

export const FuelEmbeddedSchema = SchemaFactory.createForClass(FuelEmbedded);
