import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

class Fuel {
  @Prop({ type: String, required: true })
  fuelId: string;

  @Prop({ type: String, required: true })
  fuelName: string;
}

class Employee {
  @Prop({ type: String, default: uuidv4 })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}

@Schema({ timestamps: true })
export class GeneralDeposit extends Document {
  @Prop({ type: String, default: uuidv4 })
  generalDepositId: string;

  @Prop({ type: Number, required: true })
  maxCapacity: number;

  @Prop({ type: Number, required: true })
  currentCapacity: number;

  @Prop({ type: Fuel, required: true })
  fuel: Fuel;

  @Prop({ type: Employee, required: true })
  createdBy: Employee;

  @Prop({ type: Employee })
  updatedBy?: Employee;

  @Prop({ type: Boolean, default: true })
  state: boolean;
}

export const GeneralDepositSchema =
  SchemaFactory.createForClass(GeneralDeposit);
