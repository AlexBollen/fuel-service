import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
class Customer {
  @Prop({ type: String, required: true })
  customerId: string;

  @Prop({ type: String, required: true })
  customerName: string;

  @Prop({ type: String, required: true })
  nit: string;
}

@Schema()
class Bomb {
  @Prop({ type: String, required: true })
  bombId: string;

  @Prop({ type: Number, required: true })
  bombNumber: number;
}

@Schema()
class Fuel {
  @Prop({ type: String, required: true })
  fuelId: string;

  @Prop({ type: String, required: true })
  fuelName: string;

  @Prop({ type: Types.Decimal128, required: true })
  salePriceGalon: Types.Decimal128;
}

@Schema()
class PaymentMethod {
  @Prop({ type: String, required: true })
  paymentId: string;

  @Prop({ type: String, required: true })
  methood: string;

  @Prop({ type: Types.Decimal128, required: true })
  amount: Types.Decimal128;
}

@Schema()
class FidelityCard {
  @Prop({ type: String, required: true })
  fidelityCardId: string;

  @Prop({ type: Types.Decimal128, required: true })
  earnedPoints: Types.Decimal128;

  @Prop({ type: Types.Decimal128, required: true })
  lostPoints: Types.Decimal128;
}

@Schema()
class Employee {
  @Prop({ type: String, required: true })
  employeeId: string;

  @Prop({ type: String, required: true })
  employeeName: string;
}

@Schema({ timestamps: true }) //Timestamps true para que se maneje automáticamente el createdAt y updatedAt
export class FuelSale {
  @Prop({ type: String, required: true })
  fuelSaleId: string;

  @Prop({ type: Types.Decimal128, required: true })
  amount: Types.Decimal128;

  @Prop({ type: Types.Decimal128, required: true })
  consumedQuantity: Types.Decimal128;

  @Prop({ type: Customer, required: true })
  customer: Customer;

  @Prop({ type: Bomb, required: true })
  bomb: Bomb;

  @Prop({ type: Fuel, required: true })
  fuel: Fuel;

  @Prop({ type: [PaymentMethod], required: true })
  paymentMethods: PaymentMethod[];

  @Prop({ type: FidelityCard, required: false })
  fidelityCard?: FidelityCard;

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

//HydratedDocument le da funciones y métodos adicionales a FuelSale como .save() y .populate()
//También permite usar el FuelSaleDocuement en otras partes del código para tener autocompletado y validaciones de TypeScript.
export type FuelSaleDocument = HydratedDocument<FuelSale>;

//Genera el esquema automáticamente y ya no se tiene que definir manualmente (new mongoose.Schema({...}))
export const FuelSaleSchema = SchemaFactory.createForClass(FuelSale);
