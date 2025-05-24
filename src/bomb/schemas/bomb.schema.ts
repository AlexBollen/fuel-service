import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';

export type BombDocument = HydratedDocument<Bomb>;

@Schema({ timestamps: true })
export class Bomb {
  @Prop({ type: String, required: true })
  bombId: string;

  @Prop({ type: Number, required: true })
  bombNumber: number;

  @Prop({ type: Number, required: true })
  servedQuantity?: number;

  @Prop({ type: EmployeeEmbedded, required: true })
  employeeInCharge: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: true })
  createdBy: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  updatedBy?: EmployeeEmbedded;

  @Prop({ type: Number, required: true })
  status: number;
}

export const BombSchema = SchemaFactory.createForClass(Bomb);
