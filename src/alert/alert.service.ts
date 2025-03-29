import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Alert, AlertDocumnet } from './schemas/alert.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlertService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocumnet>,
  ) {}

  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    const newAlert = new this.alertModel({
      ...createAlertDto,
      alertId: uuidv4(),
    });
    return await newAlert.save();
  }

  async findAll(): Promise<Alert[]> {
    return await this.alertModel.find({ status: true }).exec();
  }

  async findOne(alertId: string): Promise<Alert> {
    const alert = await this.alertModel
      .findOne({
        alertId: alertId,
      })
      .exec();

    if (!alert)
      throw new NotFoundException(`Alerta con ID ${alertId} no encontrada.`);
    return alert;
  }

  async remove(alertId: string): Promise<String> {
    const alert = await this.alertModel
      .findByIdAndUpdate({ alertId: alertId }, { status: false }, { new: true })
      .exec();

    if (!alert)
      throw new NotFoundException(`Alerta con ID ${alertId} no encontrada.`);
    return `Alerta con ID ${alertId} eliminada correctamente`;
  }
}
