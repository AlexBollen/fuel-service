import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class BombEmbedded {
  @Prop({ type: String, required: true })
  bombId: string;

  @Prop({ type: Number, required: true })
  bombNumber: number;
}

export const BombEmbeddedSchema = SchemaFactory.createForClass(BombEmbedded);
