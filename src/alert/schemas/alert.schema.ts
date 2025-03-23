import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmployeeEmbedded } from 'src/sale/schemas/employee.schema';

export type AlertDocumnet = HydratedDocument<Alert>;

@Schema({ timestamps: true })
export class Alert {
  @Prop({ type: String, required: true })
  alertId: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  destination: string;

  @Prop({ type: EmployeeEmbedded, required: true })
  createdBy: EmployeeEmbedded;

  @Prop({ type: Number, required: true })
  status: number;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
