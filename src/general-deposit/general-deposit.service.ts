import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateGeneralDepositDto } from './dto/create-general-deposit.dto';
import { UpdateGeneralDepositDto } from './dto/update-general-deposit.dto';
import {
  GeneralDeposit,
  GeneralDepositDocument,
} from './schemas/general-deposit.schema';

@Injectable()
export class GeneralDepositService {
  constructor(
    @InjectModel(GeneralDeposit.name)
    private generalDepositModel: Model<GeneralDepositDocument>,
  ) {}

  async create(
    createGeneralDepositDto: CreateGeneralDepositDto,
  ): Promise<GeneralDeposit> {
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
      throw new NotFoundException(
        `Depósito con ID ${generalDepositId} no encontrado.`,
      );
    }
    return deposit;
  }

  async findByFuelType(fuelId: string): Promise<GeneralDeposit> {
    const deposit = await this.generalDepositModel
      .findOne({ 'fuel.fuelId': fuelId })
      .exec();

    if (!deposit) {
      throw new NotFoundException(
        `Depósito con ID de combustible ${fuelId} no encontrado.`,
      );
    }
    return deposit;
  }

  async update(
    updateGeneralDepositDto: UpdateGeneralDepositDto,
    generalDepositId?: string,
  ): Promise<GeneralDeposit> {
    const updateData = { ...updateGeneralDepositDto };
    const depositId = generalDepositId
      ? generalDepositId
      : updateData.idProducto;

    const deposit = await this.generalDepositModel
      .findOne({ generalDepositId: depositId })
      .exec();

    if (!deposit) {
      throw new NotFoundException(
        `Depósito con ID ${generalDepositId} no encontrado.`,
      );
    }

    if (updateData.cantidad && updateData.idProducto) {
      if (deposit.currentCapacity + updateData.cantidad > deposit.maxCapacity) {
        throw new BadRequestException(
          'La cantidad excede la capacidad máxima del depósito.',
        );
      } else {
        // Si es una compra, actualizar la capacidad actual
        updateData.currentCapacity =
          deposit.currentCapacity + updateData.cantidad;

        // Eliminar los campos temporales que no deben guardarse`
        delete updateData.cantidad;
        delete updateData.idProducto;
      }
    }

    const updatedDeposit = await this.generalDepositModel
      .findOneAndUpdate({ generalDepositId: depositId }, updateData, {
        new: true,
      })
      .exec();

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
      throw new NotFoundException(
        `Depósito con ID ${generalDepositId} no encontrado.`,
      );
    }
    return `Depósito con ID ${generalDepositId} eliminado correctamente.`;
  }
}
