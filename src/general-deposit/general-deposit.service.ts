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
import { AlertService } from 'src/alert/alert.service';
import {
  GeneralDeposit,
  GeneralDepositDocument,
} from './schemas/general-deposit.schema';
import apiClientAdministration from 'src/utils/apiClient';

@Injectable()
export class GeneralDepositService {
  constructor(
    @InjectModel(GeneralDeposit.name)
    private generalDepositModel: Model<GeneralDepositDocument>,
    private readonly alertService: AlertService,
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

  async getCurrentCapacityTimeByFuelId(
    fuelId: string,
  ): Promise<{ currentCapacityTime: number }> {
    const deposit = await this.findByFuelType(fuelId);

    const timePerGallon = 5000;
    const maxQuantity = deposit.currentCapacity;
    const currentCapacityTime = maxQuantity * timePerGallon;

    console.log('CURRENT CAPACITY TIIME', currentCapacityTime);
    return {
      currentCapacityTime,
    };
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

  async checkAndCreateAlertLow(deposit: GeneralDeposit): Promise<void> {
    const afterQuantity = deposit.currentCapacity;

    if (afterQuantity <= 100) {
      await this.alertService.create({
        message: `Alerta: Nivel bajo de combustible "${deposit.fuel.fuelName}" en el depósito ${deposit.generalDepositId}. Cantidad actual: ${deposit.currentCapacity}`,
        destination: 'Administración',
        createdBy: deposit.createdBy
          ? {
              employeeId: deposit.createdBy.employeeId,
              employeeName: deposit.createdBy.employeeName,
            }
          : undefined,
        status: true,
      });
      let successful = true;
      try {
        await apiClientAdministration.post('/POST/alertas/gasolinera', {
          nombre_producto: deposit.fuel.fuelName,
        });
      } catch (_) {
        successful = false;
      }
    }
  }
}
