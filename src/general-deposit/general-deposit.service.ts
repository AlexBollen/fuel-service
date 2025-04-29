import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';
import { GeneralDeposit, GeneralDepositDocument } from './schemas/general-deposit.schema';

@Injectable()
export class GeneralDepositService {
  constructor(
    @InjectModel(GeneralDeposit.name) private generalDepositModel: Model<GeneralDepositDocument>,
  ) {}

  async create(createGeneralDepositDto: CreateGeneralDepositDto): Promise<GeneralDeposit> {
    const newGeneralDeposit = new this.generalDepositModel({
      ...createGeneralDepositDto,
      depositId: uuidv4(),
    });
    return await newGeneralDeposit.save();
  }

  async findAll(): Promise<GeneralDeposit[]> {
    return await this.generalDepositModel.find({ status: true }).exec();
  }

  async findOne(generalDepositId: string): Promise<GeneralDeposit> {
    const deposit = await this.generalDepositModel
      .findOne({ generalDepositId: generalDepositId })
      .exec();

    if (!deposit) {
      throw new NotFoundException(`Depósito con ID ${generalDepositId} no encontrado.`);
    }
    return deposit;
  }

  async update(generalDepositId: string, updateGeneralDepositDto: UpdateGeneralDepositDto): Promise<GeneralDeposit> {
    const updatedDeposit = await this.generalDepositModel
      .findOneAndUpdate(
        { generalDepositId: generalDepositId },
        { ...updateGeneralDepositDto },
        { new: true },
      )
      .exec();

    if (!updatedDeposit) {
      throw new NotFoundException(`Depósito con ID ${generalDepositId} no encontrado.`);
    }
    return updatedDeposit;
  }

  async remove(generalDepositId: string): Promise<string> {
    const deposit = await this.generalDepositModel
      .findOneAndUpdate(
        { generalDepositId: generalDepositId },
        { status: false },
        { new: true },
      )
      .exec();

    if (!deposit) {
      throw new NotFoundException(`Depósito con ID ${generalDepositId} no encontrado.`);
    }
    return `Depósito con ID ${generalDepositId} eliminado correctamente.`;
  }
}