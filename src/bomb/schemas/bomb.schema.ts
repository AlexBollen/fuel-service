import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
class Employee {
  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}

@Schema()
class EmployeeInCharge{
    @Prop({type: String, required: true})
    employeeId: String;

    @Prop({ type: String, required: true })
    employeeName: string;
}

@Schema({ timestamps: true })
export class bomb{
    @Prop({ type: String, required: true })
    bombId: string;

    @Prop({ type: Number, required: true })
    bombNumber: number;

    @Prop({ type: Types.Decimal128, required: true})
    servedQuantity: Types.Decimal128;

    @Prop({type : EmployeeInCharge, required: true })
    employeeInCharge: EmployeeInCharge

    @Prop({ type: Date, required: true })
    createdAt: Date;
   
    @Prop({ type: Employee, required: true })
    createdBy: Employee;
    
    @Prop({ type: Date, required: false })
    updatedAt?: Date;
    
    @Prop({ type: Employee, required: false })
    updatedBy?: Employee;
    
    @Prop({ type: Number, required: true })
    state: number;
}