import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { FuelType, FuelTypeDocument } from './schemas/fuel-type.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

@Injectable()
export class FuelTypesService {
  constructor(
    @InjectModel(FuelType.name) private fuelTypeModel: Model<FuelTypeDocument>,
  ) {}

  async create(createFuelTypeDto: CreateFuelTypeDto): Promise<FuelType> {
    const newFuelType = new this.fuelTypeModel({
      ...createFuelTypeDto,
      fuelId: uuidv4(),
    });
    return newFuelType.save();
  }

  async findAll(): Promise<FuelType[]> {
    return this.fuelTypeModel.find({ status: true }).exec();
  }

  async findOne(id: string): Promise<FuelType> {
    const fuelType = await this.fuelTypeModel.findOne({ fuelId: id }).exec();
    if (!fuelType) {
      throw new NotFoundException(`FuelType con ID "${id}" no encontrado.`);
    }
    return fuelType;
  }

  async update(
    fuelId: string,
    updateFuelTypeDto: UpdateFuelTypeDto,
  ): Promise<FuelType> {
    const updatedFuelType = await this.fuelTypeModel.findOneAndUpdate(
      { fuelId, status: true },
      { ...updateFuelTypeDto, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedFuelType) {
      throw new NotFoundException(`FuelType con ID "${fuelId}" no encontrado.`);
    }
    return updatedFuelType;
  }

  async remove(id: string): Promise<FuelType> {
    const updatedFuelType = await this.fuelTypeModel
      .findOneAndUpdate({ fuelId: id }, { status: false }, { new: true })
      .exec();

    if (!updatedFuelType) {
      throw new NotFoundException(`FuelType con ID "${id}" no encontrado.`);
    }

    return updatedFuelType;
  }
}
