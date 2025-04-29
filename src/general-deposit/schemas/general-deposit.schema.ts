import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';
import { FuelEmbedded } from 'src/sale/schemas/fuel.schema';
import { v4 as uuidv4 } from 'uuid';

export type GeneralDepositDocument = HydratedDocument<GeneralDeposit>;

@Schema({ timestamps: true })
export class GeneralDeposit {
  @Prop({ type: String, default: uuidv4 })
  generalDepositId: string;

  @Prop({ type: Number, required: true })
  maxCapacity: number;

  @Prop({ type: Number, required: true })
  currentCapacity: number;

  @Prop({ type: FuelEmbedded, required: true })
  fuel: FuelEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  createdBy?: EmployeeEmbedded;

  @Prop({ type: EmployeeEmbedded, required: false })
  updatedBy?: EmployeeEmbedded;

  @Prop({ type: Boolean, default: true })
  status: boolean;
}

export const GeneralDepositSchema =
  SchemaFactory.createForClass(GeneralDeposit);
