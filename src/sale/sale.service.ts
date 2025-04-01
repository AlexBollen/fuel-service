import { Injectable, NotFoundException, InternalServerErrorException  } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import axios, { Axios } from 'axios';



@Injectable()
export class SaleService {

  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}


  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
   
    try {
      const newSale = new this.saleModel({
        ...createSaleDto,
        saleId: uuidv4(),
      });
  
      if(!newSale.paymentMethods){
       /* const payment = {
          paymentId:  '1234',
          methood: 'cash',
          amount: '100.00'
        }
        newSale.paymentMethods.push(payment)*/
      }
  
      if(!newSale.customer){
        /*const customer = {
          customerId: '1234',
          customerName: 'Juan',
          nit: '123'
        }
  
        newSale.customer = customer*/
      }
  
      if(newSale.fidelityCard){
        try {
          const response = await axios.post('https://payments/post/fidelitycard/', {
           fidelityCard: newSale.fidelityCard
          });
      
        } catch (error) {
          throw new InternalServerErrorException('Ocurrió un error al registrar la tarjeta de fidelidad: ', error);
        }
      }
  
      return await newSale.save();
    } catch (error) {
      throw new InternalServerErrorException('No se pudo completar la venta: ', error);
    }
    
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
