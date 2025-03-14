import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fuel } from './schemas/fuel-gas-station.schema';

@Injectable()
export class FuelGasStationService {
  constructor(@InjectModel(Fuel.name) private fuelModel: Model<Fuel>) {}

  async create(fuelData: Partial<Fuel>): Promise<Fuel> {
    const newFuel = new this.fuelModel(fuelData);
    return newFuel.save();
  }

  async findAll(): Promise<Fuel[]> {
    return this.fuelModel.find().exec();
  }

  async findById(id: string): Promise<Fuel> {
    return this.fuelModel.findOne({ fuelId: id }).exec();
  }

  async update(id: string, updateData: Partial<Fuel>): Promise<Fuel> {
    return this.fuelModel
      .findOneAndUpdate({ fuelId: id }, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Fuel> {
    return this.fuelModel.findOneAndDelete({ fuelId: id }).exec();
  }
}
