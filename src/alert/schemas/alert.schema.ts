import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
class Employee {
  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}

@Schema({ timestamps: true })
export class Alert {
  @Prop({ type: String, required: true })
  alertId: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  destination: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Employee, required: true })
  createdBy: Employee;

  @Prop({ type: Number, required: true })
  state: number;
}
