import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { BombService } from 'src/bomb/bomb.service';
import { FuelTypesService } from 'src/fuel-types/fuel-types.service';
import { Types } from 'mongoose';
import { SERVICIO_PAGOS, SERVICIO_ADMINISTRACION } from 'src/constants/urls';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private readonly bombService: BombService,
    private readonly fuelTypesService: FuelTypesService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const newSale = new this.saleModel({
        ...createSaleDto,
        fuelSaleId: uuidv4(),
      });

      let suscesfully = true;
      let servedQuantityBomb = 0;

      if (!newSale.bomb.bombNumber) {
        const bomb = await this.bombService.findOne(newSale.bomb.bombId);

        if (bomb) {
          newSale.bomb.bombNumber = bomb.bombNumber;
          //servedQuantityBomb = bomb.servedQuantity;
        } else {
          throw new InternalServerErrorException('Bomba no encontrada');
        }
      }

      if (!newSale.fuel.fuelName || !newSale.fuel.salePriceGalon) {
        const fuel = await this.fuelTypesService.findOne(newSale.fuel.fuelId);

        if (fuel) {
          newSale.fuel.fuelName = fuel.fuelName;
          newSale.fuel.salePriceGalon = Types.Decimal128.fromString(
            fuel.salePriceGalon.toString(),
          );
        } else {
          throw new InternalServerErrorException('Bomba no encontrada');
        }
      }

      if (!newSale.amount && !newSale.consumedQuantity) {
        throw new BadRequestException(
          'Se necesita el total de la venta o la cantidad consumida de combustible',
        );
      } else if (!newSale.amount) {
        newSale.amount = Types.Decimal128.fromString(
          (
            parseFloat(newSale.consumedQuantity.toString()) *
            parseFloat(newSale.fuel.salePriceGalon.toString())
          ).toFixed(2),
        );
      } else if (!newSale.consumedQuantity) {
        newSale.amount = Types.Decimal128.fromString(
          (
            parseFloat(newSale.amount.toString()) /
            parseFloat(newSale.fuel.salePriceGalon.toString())
          ).toFixed(2),
        );
      }

      if (newSale.paymentMethods) {
        await Promise.all(
          newSale.paymentMethods.map(async (methodItem) => {
            try {
              const response = await axios.get(
                `${SERVICIO_PAGOS}/metodos/obtener/${methodItem.paymentId}`,
              );
              if (response.data.Metodo) {
                methodItem.method = response.data.Metodo;
              } else {
                suscesfully = false;
              }
            } catch (_) {
              suscesfully = false;
            }
          }),
        );
      }

      if (!newSale.customer.nit) {
        newSale.customer.customerName = 'CF';
      }

      if (!newSale.createdBy.employeeName) {
        try {
          const employee = await axios.get(
            `${SERVICIO_ADMINISTRACION}/GET/empleados/${newSale.createdBy.employeeId}`,
          );
          if (employee.data.empleado) {
            newSale.createdBy.employeeName =
              employee.data.empleado.nombres +
              ' ' +
              employee.data.empleado.apellidos;
          } else {
            suscesfully = false;
          }
        } catch (_) {
          suscesfully = false;
        }
      }

      const metodosPago = createSaleDto.paymentMethods.map((pm) => ({
        IdMetodo: pm.paymentId,
        Monto: pm.amount,
        ...(pm.bankId && { IdBanco: pm.bankId }),
        ...(pm.cardNumber && { Notarjeta: pm.cardNumber }),
      }));

      try {
        const responseTransaction = await axios.post(
          `${SERVICIO_PAGOS}/transaccion/crear/`,
          {
            Nit: newSale.customer.nit,
            idCaja: '',
            idServicioTransaccion: 0,
            detalle: [
              {
                producto: newSale.fuel.fuelName,
                cantidad: newSale.consumedQuantity,
                precio: newSale.fuel.salePriceGalon,
              },
            ],
            MetodosPago: metodosPago,
          },
        );

        if (newSale.customer.nit != 'CF') {
          if (responseTransaction.data.Factura.Cliente) {
            const customer = responseTransaction.data.Factura.Cliente;
            if (customer.IdCliente)
              newSale.customer.customerId = customer.IdCliente;

            if (customer?.NombreCliente || customer?.ApellidoCliente) {
              const nombre = customer?.NombreCliente ?? '';
              const apellido = customer?.ApellidoCliente ?? '';
              newSale.customer.customerName = `${nombre} ${apellido}`.trim();
            }
          }
        }

        const transaction = responseTransaction.data;
        if (transaction.IdTransaccion) {
          //newSale.idTransaction = transaction.IdTransaccion
        }
        if (transaction.NoTransaccion) {
          //newSale.noTransaction = transaction.IdTransaccion
        }
        if (transaction.Factura.NoFactura) {
          //newSale.noBill = transaction.Factura.NoFactura
        }
      } catch (_) {
        suscesfully = false;
      }

      //await this.bombService.update(newSale.bomb.bombId, {
      // status = 3,
      // servedQuantity: servedQuantityBomb + newSale.consumedQuantity
      // });

      /*this.bombService.update(newSale.bomb.bombId, {
        servedQuantity: servedQuantityBomb + newSale.consumedQuantity
      })*/

      /*
      const capacity = this.generalDepositService.capacity()
      this.generalDepositService.update({
        currentCapacity: 
      })
      */

      if (suscesfully) {
        //No missing data
        newSale.status = 1;
      } else {
        //Missing some data
        newSale.status = 2;
      }
      //return await newSale.save();
      return newSale;
    } catch (error) {
      console.error('Error en createSale:', error);
      throw new InternalServerErrorException(
        `No se pudo completar la venta: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleModel.find({ status: 1 }).exec();
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
      .findOneAndUpdate({ saleId }, { ...updateSaleDto }, { new: true })
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
