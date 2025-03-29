import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class SaleService {

  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}


  async create(createSaleDto: CreateSaleDto): Promise<Sale> {

    

    //Aquí debería ir alguna lógica del negocio



   
    const newSale = new this.saleModel({
      ...createSaleDto,
      saleId: uuidv4(),
    });
    return await newSale.save();
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleModel.find({ status: 1}).exec();
  }

  async findOne(saleId: string) {
    const sale = await this.saleModel
    .findOne({
      saleId: saleId,
    })
    .exec();

    if (!sale)
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    return sale;
  }

  async update(saleId: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    
    const sale = await this.saleModel.findOne({ saleId }).exec();

   
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    }

    return this.saleModel
      .findOneAndUpdate(
          { saleId }, 
          { ...updateSaleDto }, 
          { new: true } 
        )
        .exec();
  }

  async remove(saleId: string) {
    const sale = await this.saleModel
    .findByIdAndUpdate({ saleId: saleId }, { status: 0 }, { new: true })
    .exec();

  if (!sale)
    throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
  return `Venta con ID ${saleId} eliminada correctamente`;
  }
}
