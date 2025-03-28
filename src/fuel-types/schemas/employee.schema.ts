import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class EmployeeEmbedded {
  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}
