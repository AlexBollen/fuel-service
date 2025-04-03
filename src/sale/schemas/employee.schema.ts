import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class EmployeeEmbedded {
  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: false })
  employeeName?: string;
}

export const EmployeeEmbeddedSchema =
  SchemaFactory.createForClass(EmployeeEmbedded);
