import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class FuelEmbedded {
  @Prop({ type: String, required: true })
  fuelId: string;

  @Prop({ type: String, required: false })
  fuelName?: string;

  @Prop({ type: Types.Decimal128, required: false })
  salePriceGalon?: Types.Decimal128;
}

export const FuelEmbeddedSchema = SchemaFactory.createForClass(FuelEmbedded);
