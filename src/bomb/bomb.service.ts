import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBombDto } from './dto/create-bomb.dto';
import { UpdateBombDto } from './dto/update-bomb.dto';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Bomb, BombDocument } from './schemas/bomb.schema';
import { BombGateway } from './bomb.gateway';

@Injectable()
export class BombService {
  constructor(
    @InjectModel(Bomb.name) private bombModel: Model<BombDocument>,
    private readonly bombGateway: BombGateway, // Add the gateway to emit events by WebSockets
  ) {}

  async create(createBombDto: CreateBombDto): Promise<Bomb> {
    const newBomb = new this.bombModel({
      ...createBombDto,
      bombId: uuidv4(),
    });
    return await newBomb.save();
  }

  async findAll(): Promise<Bomb[]> {
    return await this.bombModel.find().exec();
  }

  async findOne(bombId: string): Promise<Bomb> {
    const bomb = await this.bombModel.findOne({ bombId }).exec();
    if (!bomb) {
      throw new NotFoundException(`Bomba con ID ${bombId} no encontrada.`);
    }
    return bomb;
  }

  async findByStatus(status: number): Promise<Bomb[]> {
    return await this.bombModel.find({ status }).exec();
  }

  async update(bombId: string, updateBombDto: UpdateBombDto): Promise<Bomb> {
    const bomb = await this.bombModel.findOne({ bombId }).exec();

    if (!bomb) {
      throw new NotFoundException(`Bomba con ID ${bombId} no encontrada.`);
    }

    return this.bombModel
      .findOneAndUpdate({ bombId }, updateBombDto, { new: true })
      .exec();
  }

  async remove(bombId: string): Promise<string> {
    const bomb = await this.bombModel
      .findOneAndUpdate({ bombId: bombId }, { status: 0 }, { new: true })
      .exec();

    if (!bomb) {
      throw new NotFoundException(`Bomba con ID ${bombId} no encontrada.`);
    }
    return `Se eliminó correctamente la bomba: ${bombId} `;
  }

  // Function to update a bomb status
  async updateStatus(bombId: string, status: number): Promise<Bomb> {
    const bomb = await this.bombModel.findOne({ bombId });

    if (!bomb) throw new NotFoundException('Bomba no encontrada');

    bomb.status = status;
    await bomb.save();

    // Emit WebSocket event in real time
    this.bombGateway.sendStatusUpdate(bombId, status);

    return bomb;
  }
}
