import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

class Employee {
  @Prop({ type: String, default: uuidv4 })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}

@Schema({ timestamps: true })
export class FuelType extends Document {
  @Prop({ type: String, default: uuidv4 })
  fuelId: string;

  @Prop({ type: String, required: true })
  fuelName: string;

  @Prop({ type: Number, required: true })
  costPriceGalon: number;

  @Prop({ type: Number, required: true })
  salePriceGalon: number;

  @Prop({ type: Employee, required: true })
  createdBy: Employee;

  @Prop({ type: Employee })
  updatedBy?: Employee;

  @Prop({ type: Boolean, default: true })
  state: boolean;
}

export const FuelSchema = SchemaFactory.createForClass(FuelType);
