import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';
import { v4 as uuidv4 } from 'uuid';

export type FuelTypeDocument = HydratedDocument<FuelType>;

@Schema({ timestamps: true })
export class FuelType {
  @Prop({ type: String, default: uuidv4 })
  fuelId: string;

  @Prop({ type: String, required: true })
  fuelName: string;

  @Prop({ type: Number, required: true })
  costPriceGalon: number;

  @Prop({ type: Number, required: true })
  salePriceGalon: number;

  @Prop({ type: EmployeeEmbedded, required: true })
  createdBy: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  updatedBy?: EmployeeEmbedded;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const FuelTypeSchema = SchemaFactory.createForClass(FuelType);
