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
import { GeneralDepositService } from 'src/general-deposit/general-deposit.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private readonly bombService: BombService,
    private readonly fuelTypesService: FuelTypesService,
    private readonly generalDespositService: GeneralDepositService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const newSale = new this.saleModel({
        ...createSaleDto,
        fuelSaleId: uuidv4(),
      });

      let suscesfully = true;
      let servedQuantityBomb: number = 0.0;

      if (!newSale.bomb.bombNumber) {
        const bomb = await this.bombService.findOne(newSale.bomb.bombId);

        if (bomb) {
          newSale.bomb.bombNumber = bomb.bombNumber;
          servedQuantityBomb = bomb.servedQuantity;
        } else {
          throw new InternalServerErrorException('Bomba no encontrada');
        }
      }

      if (!newSale.fuel.fuelName || !newSale.fuel.salePriceGalon) {
        const fuel = await this.fuelTypesService.findOne(newSale.fuel.fuelId);

        if (fuel) {
          newSale.fuel.fuelName = fuel.fuelName;
          newSale.fuel.salePriceGalon = fuel.salePriceGalon;
        } else {
          throw new InternalServerErrorException('Bomba no encontrada');
        }
      }

      if (!newSale.amount && !newSale.consumedQuantity) {
        throw new BadRequestException(
          'Se necesita el total de la venta o la cantidad consumida de combustible',
        );
      } else if (!newSale.amount) {
        newSale.amount = newSale.consumedQuantity * newSale.fuel.salePriceGalon;
      } else if (!newSale.consumedQuantity) {
        newSale.consumedQuantity = newSale.amount / newSale.fuel.salePriceGalon;
      }

      //let deposit = await this.generalDespositService.findOne(1);
      let depositQuantity = 0; // deposit.actualQuantity
      if (depositQuantity) {
        let afterQuantity = 10000; //depositQuantity - newSale.consumedQuantity
        if (afterQuantity <= 0.0) {
          throw new InternalServerErrorException(
            `No se pudo completar la venta: No hay suficiente cantidad de combustible en el deposito general`,
          );
        }
      }

      if (newSale.paymentMethods) {
        await Promise.all(
          newSale.paymentMethods.map(async (methodItem) => {
            try {
              const response = await axios.get(
                `${SERVICIO_PAGOS}/metodos/obtener/${methodItem.paymentId}`,
              );
              if (response.data.metodo) {
                methodItem.method = response.data.metodo;
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
        idMetodo: pm.paymentId,
        Monto: pm.amount,
        ...(pm.bankId && { idBanco: pm.bankId }),
        ...(pm.cardNumber && { Notarjeta: pm.cardNumber }),
      }));

      try {
        const responseTransaction = await axios.post(
          `${SERVICIO_PAGOS}/transaccion/crear/`,
          {
            nit: newSale.customer.nit,
            idCaja: '',
            idServicioTransaccion: 0,
            detalle: [
              {
                producto: newSale.fuel.fuelName,
                cantidad: newSale.consumedQuantity,
                precio: newSale.fuel.salePriceGalon,
              },
            ],
            metodosPago: metodosPago,
          },
        );

        if (newSale.customer.nit != 'CF') {
          if (responseTransaction.data.factura.cliente) {
            const customer = responseTransaction.data.factura.cliente;
            if (customer.idCliente)
              newSale.customer.customerId = customer.idCliente;

            if (customer?.nombreCliente || customer?.apellidoCliente) {
              const nombre = customer?.nombreCliente ?? '';
              const apellido = customer?.apellidoCliente ?? '';
              newSale.customer.customerName = `${nombre} ${apellido}`.trim();
            } else {
              suscesfully = false;
            }
          }
        }

        const transaction = responseTransaction.data;

        if (transaction.idTransaccion) {
          newSale.transactionId = transaction.idTransaccion;
        } else {
          suscesfully = false;
        }
        if (transaction.noTransaccion) {
          newSale.transactionNumber = transaction.noTransaccion;
        } else {
          suscesfully = false;
        }
        if (transaction.noAutorizacion) {
          newSale.authorizationNumber = transaction.noAutorizacion;
        } else {
          suscesfully = false;
        }
        if (transaction.factura?.noFactura) {
          newSale.billNumber = transaction.factura.noFactura;
        } else {
          suscesfully = false;
        }
      } catch (_) {
        suscesfully = false;
      }

      const actualQuantityServed: number =
        servedQuantityBomb + newSale.consumedQuantity;

      await this.changePumpState(
        newSale.bomb.bombId,
        newSale.consumedQuantity,
        actualQuantityServed,
      );

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

    if (sale.billNumber) {
      try {
        await axios.delete(
          `${SERVICIO_PAGOS}/transaccion/anular/${sale.billNumber}`,
        );
      } catch (error) {
        throw new InternalServerErrorException(
          `No se pudo eliminar la factura y la venta ${error.message}`,
        );
      }
    }

    if (!sale)
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    return `Venta con ID ${saleId} eliminada correctamente`;
  }

  async changePumpState(
    bombId: string,
    consumedQuantity: number,
    servedQuantityBomb?: number,
  ) {
    const bomb = await this.bombService.findOne(bombId);
    if (!bomb) throw new Error('Bomba no encontrada');

    const previousState = 2;

    await this.bombService.pumpFuel(bombId, {
      status: 3,
      servedQuantity: servedQuantityBomb,
    });

    const duration = Math.floor(50000 * consumedQuantity); // Duration per galon: 5 seconds

    setTimeout(async () => {
      bomb.status = previousState;
      await this.bombService.pumpFuel(bombId, {
        status: previousState,
      });
    }, duration);
  }
}
