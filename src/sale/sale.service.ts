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
import { BombService } from 'src/bomb/bomb.service';
import { FuelTypesService } from 'src/fuel-types/fuel-types.service';
import { Types } from 'mongoose';
import { GeneralDepositService } from 'src/general-deposit/general-deposit.service';
import apiClientAdministration, {
  apiClientPayments,
} from 'src/utils/apiClient';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private readonly bombService: BombService,
    private readonly fuelTypesService: FuelTypesService,
    private readonly generalDepositService: GeneralDepositService,
    private readonly alertService: AlertService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const newSale = new this.saleModel({
        ...createSaleDto,
        fuelSaleId: uuidv4(),
      });

      let successful = true;
      let servedQuantityBomb: number = 0.0;
      let afterQuantity: number = 0.0;

      if (!newSale.bomb.bombNumber) {
        const bomb = await this.bombService.findOne(newSale.bomb.bombId);

        if (bomb) {
          newSale.bomb.bombNumber = bomb.bombNumber;
          servedQuantityBomb = bomb.servedQuantity;
        } else {
          throw new NotFoundException('Bomba no encontrada');
        }
      }

      if (!newSale.fuel.fuelName || !newSale.fuel.salePriceGalon) {
        const fuel = await this.fuelTypesService.findOne(newSale.fuel.fuelId);

        if (fuel) {
          newSale.fuel.fuelName = fuel.fuelName;
          newSale.fuel.salePriceGalon = fuel.salePriceGalon;
        } else {
          throw new NotFoundException('Combustible no encontrado');
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

      let deposit = await this.generalDepositService.findByFuelType(
        newSale.fuel.fuelId,
      );
      if (deposit) {
        let depositQuantity = deposit.currentCapacity;
        if (depositQuantity) {
          afterQuantity = depositQuantity - newSale.consumedQuantity;
          if (afterQuantity <= 0.0) {
            throw new InternalServerErrorException(
              `No se pudo completar la venta: No hay suficiente cantidad de combustible en el deposito general`,
            );
          }
        }
      } else {
        throw new NotFoundException('Deposito no encontrado');
      }

      //Quantity served by the bomb
      const actualQuantityServed: number =
        servedQuantityBomb + newSale.consumedQuantity;

      await this.changePumpState(
        newSale.bomb.bombId,
        newSale.consumedQuantity,
        actualQuantityServed,
      );

      //Current quantity in the general deposit
      await this.generalDepositService.update(deposit.generalDepositId, {
        currentCapacity: afterQuantity,
      });

      if (afterQuantity <= 100) {
      }

      // if (newSale.paymentMethods) {
      //   await Promise.all(
      //     newSale.paymentMethods.map(async (methodItem) => {
      //       try {
      //         const response = await apiClientPayments.get(
      //           `metodos/obtener/${methodItem.paymentId}`,
      //         );
      //         if (response.data.metodo) {
      //           methodItem.method = response.data.metodo;
      //         } else {
      //           successful = false;
      //         }
      //       } catch (_) {
      //         successful = false;
      //       }
      //     }),
      //   );
      // }

      if (!newSale.customer.nit) {
        newSale.customer.customerName = 'CF';
      }

      if (!newSale.createdBy.employeeName) {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${newSale.createdBy.employeeId}`,
          );

          if (employee.data.empleado) {
            newSale.createdBy.employeeName =
              employee.data.empleado.nombres +
              ' ' +
              employee.data.empleado.apellidos;
          } else {
            successful = false;
          }
        } catch (error) {
          successful = false;
        }
      }

      const metodosPago = createSaleDto.paymentMethods.map((pm) => ({
        IdMetodo: pm.paymentId,
        Monto: pm.amount,
        ...(pm.bankId && { IdBanco: pm.bankId }),
        ...(pm.cardNumber && { Notarjeta: pm.cardNumber }),
      }));

      try {
        const responseTransaction = await apiClientPayments.post(
          `transacciones/crear/`,
          {
            Nit: newSale.customer.nit,
            IdCaja: createSaleDto.cashRegisterId,
            IdServicioTransaccion: 4,
            Detalle: [
              {
                Producto: newSale.fuel.fuelName,
                Cantidad: newSale.consumedQuantity,
                Precio: newSale.fuel.salePriceGalon,
                Descuento: 0,
              },
            ],
            MetodosPago: metodosPago,
          },
        );

        if (responseTransaction.data) {
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
                successful = false;
              }
            }
          }

          const transaction = responseTransaction.data;

          if (transaction.idTransaccion) {
            newSale.transactionId = transaction.idTransaccion;
          } else {
            successful = false;
          }
          if (transaction.noTransaccion) {
            newSale.transactionNumber = transaction.noTransaccion;
          } else {
            successful = false;
          }
          if (transaction.noAutorizacion) {
            newSale.authorizationNumber = transaction.noAutorizacion;
          } else {
            successful = false;
          }
          if (transaction.factura?.noFactura) {
            newSale.billNumber = transaction.factura.noFactura;
          } else {
            successful = false;
          }
        } else {
          successful = false;
        }
      } catch (_) {
        successful = false;
        console.error("ERROR: ",_)
      }

      if (successful) {
        //No missing data
        newSale.status = 1;
      } else {
        //Missing some data
        newSale.status = 2;
      }
      return await newSale.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo completar la venta: ${error.message}`,
      );
    }
  }

  async createFullTankSale(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const newSale = new this.saleModel({
        ...createSaleDto,
        fuelSaleId: uuidv4(),
      });

      if (!newSale.bomb.bombNumber) {
        const bomb = await this.bombService.findOne(newSale.bomb.bombId);

        if (bomb) {
          newSale.bomb.bombNumber = bomb.bombNumber;
        } else {
          throw new NotFoundException('Bomba no encontrada');
        }
      }

      if (!newSale.fuel.fuelName || !newSale.fuel.salePriceGalon) {
        const fuel = await this.fuelTypesService.findOne(newSale.fuel.fuelId);

        if (fuel) {
          newSale.fuel.fuelName = fuel.fuelName;
          newSale.fuel.salePriceGalon = fuel.salePriceGalon;
        } else {
          throw new NotFoundException('Combustible no encontrado');
        }
      }

      if (!newSale.createdBy.employeeName) {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${newSale.createdBy.employeeId}`,
          );

          if (employee.data.empleado) {
            newSale.createdBy.employeeName =
              employee.data.empleado.nombres +
              ' ' +
              employee.data.empleado.apellidos;
          }
        } catch (_) {}
      }

      let maxTime: number;
      const generalDeposit = await this.generalDepositService.findByFuelType(
        newSale.fuel.fuelId,
      );
      if (generalDeposit) {
        maxTime = generalDeposit.currentCapacity * 5000;
      }

      await this.bombService.updateStatus(newSale.bomb.bombId, 2);

      newSale.status = 3;

      return await newSale.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo completar la venta: ${error.message}`,
      );
    }
    return;
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleModel.find({ status: { $in: [1, 2] } }).exec();
  }

  async findOne(saleId: string) {
    const sale = await this.saleModel
      .findOne({
        fuelSaleId: saleId,
      })
      .exec();

    if (!sale)
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    return sale;
  }

  async update(saleId: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.saleModel.findOne({ fuelSaleId: saleId }).exec();

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    }

    let successful = true;

    const needsUpdateUpdatedBy =
      updateSaleDto.updatedBy && !updateSaleDto.updatedBy.employeeName;
    const needsUpdateCreatedBy =
      updateSaleDto.createdBy && !updateSaleDto.createdBy.employeeName;

    if (needsUpdateUpdatedBy && needsUpdateCreatedBy) {
      const updatedId = updateSaleDto.updatedBy.employeeId;
      const createdId = updateSaleDto.createdBy.employeeId;

      if (updatedId === createdId) {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${updatedId}`,
          );
          if (employee.data.empleado) {
            const fullName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
            updateSaleDto.updatedBy.employeeName = fullName;
            updateSaleDto.createdBy.employeeName = fullName;
          } else {
            successful = false;
          }
        } catch (_) {
          successful = false;
        }
      } else {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${updatedId}`,
          );
          if (employee.data.empleado) {
            updateSaleDto.updatedBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
          } else {
            successful = false;
          }
        } catch (_) {
          successful = false;
        }

        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${createdId}`,
          );
          if (employee.data.empleado) {
            updateSaleDto.createdBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
          } else {
            successful = false;
          }
        } catch (_) {
          successful = false;
        }
      }
    } else {
      if (needsUpdateUpdatedBy) {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${updateSaleDto.updatedBy.employeeId}`,
          );
          if (employee.data.empleado) {
            updateSaleDto.updatedBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
          } else {
            successful = false;
          }
        } catch (_) {
          successful = false;
        }
      }

      if (needsUpdateCreatedBy) {
        try {
          const employee = await apiClientAdministration.get(
            `/GET/empleados/${updateSaleDto.createdBy.employeeId}`,
          );
          if (employee.data.empleado) {
            updateSaleDto.createdBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
          } else {
            successful = false;
          }
        } catch (_) {
          successful = false;
        }
      }
    }

    // if (updateSaleDto.paymentMethods) {
    //   if (updateSaleDto.paymentMethods) {
    //     await Promise.all(
    //       updateSaleDto.paymentMethods.map(async (methodItem) => {
    //         try {
    //           const response = await apiClientPayments.get(
    //             `/metodos/obtener/${methodItem.paymentId}`,
    //           );
    //           if (response.data.metodo) {
    //             methodItem.method = response.data.metodo;
    //           } else {
    //             successful = false;
    //           }
    //         } catch (_) {
    //           successful = false;
    //         }
    //       }),
    //     );
    //   }
    // }

    if (!sale.billNumber && updateSaleDto.paymentMethods) {
      try {
        const metodosPago = updateSaleDto.paymentMethods.map((pm) => ({
          IdMetodo: pm.paymentId,
          Monto: pm.amount,
          ...(pm.bankId && { IdBanco: pm.bankId }),
          ...(pm.cardNumber && { Notarjeta: pm.cardNumber }),
        }));

        const responseTransaction = await apiClientPayments.post(
          `/transaccion/crear/`,
          {
            Nit: updateSaleDto.customer.nit,
            IdCaja: updateSaleDto.cashRegisterId,
            IdServicioTransaccion: 3002,
            Detalle: [
              {
                Producto: sale.fuel.fuelName,
                Cantidad: sale.consumedQuantity,
                Precio: sale.fuel.salePriceGalon,
                Descuento: 0,
              },
            ],
            MetodosPago: metodosPago,
          },
        );

        if (updateSaleDto.customer) {
          if (updateSaleDto.customer.nit != 'CF') {
            if (responseTransaction.data.factura.cliente) {
              const customer = responseTransaction.data.factura.cliente;
              if (customer.idCliente)
                updateSaleDto.customer.customerId = customer.idCliente;

              if (customer?.nombreCliente || customer?.apellidoCliente) {
                const nombre = customer?.nombreCliente ?? '';
                const apellido = customer?.apellidoCliente ?? '';
                updateSaleDto.customer.customerName =
                  `${nombre} ${apellido}`.trim();
              } else {
                successful = false;
              }
            }
          }
        }

        const transaction = responseTransaction.data;

        if (transaction.idTransaccion) {
          updateSaleDto.transactionId = transaction.idTransaccion;
        } else {
          successful = false;
        }
        if (transaction.noTransaccion) {
          updateSaleDto.transactionNumber = transaction.noTransaccion;
        } else {
          successful = false;
        }
        if (transaction.noAutorizacion) {
          updateSaleDto.authorizationNumber = transaction.noAutorizacion;
        } else {
          successful = false;
        }
        if (transaction.factura?.noFactura) {
          updateSaleDto.billNumber = transaction.factura.noFactura;
        } else {
          successful = false;
        }
      } catch (_) {
        successful = false;
      }
    } else if (updateSaleDto.customer.nit) {
      if (updateSaleDto.customer.nit != 'CF') {
        try {
          const response = await apiClientPayments.get(
            `/cliente/obtener/${updateSaleDto.customer.nit}`,
          );

          if (response.data.factura.cliente) {
            const customer = response.data.factura.cliente;
            if (customer.idCliente)
              updateSaleDto.customer.customerId = customer.idCliente;

            if (customer?.nombreCliente || customer?.apellidoCliente) {
              const nombre = customer?.nombreCliente ?? '';
              const apellido = customer?.apellidoCliente ?? '';
              updateSaleDto.customer.customerName =
                `${nombre} ${apellido}`.trim();
            } else {
              successful = false;
            }
          }
        } catch (_) {
          successful = false;
        }
      }
    }

    if (successful) {
      updateSaleDto.status = 1;
    } else {
      updateSaleDto.status = 2;
    }
    return this.saleModel
      .findOneAndUpdate(
        { fuelSaleId: saleId },
        { ...updateSaleDto },
        { new: true },
      )
      .exec();
  }

  async updateSaleFullTank(
    saleId: string,
    updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    const sale = await this.saleModel.findOne({ fuelSaleId: saleId }).exec();

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${saleId} no encontrada.`);
    }

    if (sale.status == 3) {
      if (updateSaleDto.totalTime) {
        updateSaleDto.consumedQuantity = Number(updateSaleDto.totalTime) / 5000;
        updateSaleDto.amount =
          updateSaleDto.consumedQuantity * sale.fuel.salePriceGalon;
        updateSaleDto.status = 4;

        let servedQuantityBomb: number = 0.0;

        if (!sale.bomb.bombNumber) {
          const bomb = await this.bombService.findOne(sale.bomb.bombId);

          if (bomb) {
            sale.bomb.bombNumber = bomb.bombNumber;
            servedQuantityBomb = bomb.servedQuantity;
          } else {
            throw new NotFoundException('Bomba no encontrada');
          }
        }

        let afterQuantity: number = 0.0;
        let deposit = await this.generalDepositService.findByFuelType(
          sale.fuel.fuelId,
        );
        if (deposit) {
          let depositQuantity = deposit.currentCapacity;
          if (depositQuantity) {
            afterQuantity =
              depositQuantity - Number(updateSaleDto.consumedQuantity);
            if (afterQuantity <= 0.0) {
              throw new InternalServerErrorException(
                `No se pudo completar la venta: No hay suficiente cantidad de combustible en el deposito general`,
              );
            }
          }
          await this.generalDepositService.update(deposit.generalDepositId, {
            currentCapacity: afterQuantity,
          });
        }

        const actualQuantity =
          servedQuantityBomb + Number(updateSaleDto.consumedQuantity);

        let newStatus;
        if (actualQuantity >= 1000) {
          newStatus = 4;
        } else {
          newStatus = 1;
        }
        await this.bombService.updateStatus(
          sale.bomb.bombId,
          newStatus,
          actualQuantity,
        );

        return this.saleModel
          .findOneAndUpdate(
            { fuelSaleId: saleId },
            { ...updateSaleDto },
            { new: true },
          )
          .exec();
      } else {
        throw new BadRequestException(
          'Se necesita el tiempo total que estuvo sirviendo la bomba',
        );
      }
    } else {
      try {
        let successful = true;

        const needsUpdateUpdatedBy =
          updateSaleDto.updatedBy && !updateSaleDto.updatedBy.employeeName;
        const needsUpdateCreatedBy =
          updateSaleDto.createdBy && !updateSaleDto.createdBy.employeeName;

        if (needsUpdateUpdatedBy && needsUpdateCreatedBy) {
          const updatedId = updateSaleDto.updatedBy.employeeId;
          const createdId = updateSaleDto.createdBy.employeeId;

          if (updatedId === createdId) {
            try {
              const employee = await apiClientAdministration.get(
                `/GET/empleados/${updatedId}`,
              );
              if (employee.data.empleado) {
                const fullName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
                updateSaleDto.updatedBy.employeeName = fullName;
                updateSaleDto.createdBy.employeeName = fullName;
              } else {
                successful = false;
              }
            } catch (_) {
              successful = false;
            }
          } else {
            try {
              const employee = await apiClientAdministration.get(
                `/GET/empleados/${updatedId}`,
              );
              if (employee.data.empleado) {
                updateSaleDto.updatedBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
              } else {
                successful = false;
              }
            } catch (_) {
              successful = false;
            }

            try {
              const employee = await apiClientAdministration.get(
                `/GET/empleados/${createdId}`,
              );
              if (employee.data.empleado) {
                updateSaleDto.createdBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
              } else {
                successful = false;
              }
            } catch (_) {
              successful = false;
            }
          }
        } else {
          if (needsUpdateUpdatedBy) {
            try {
              const employee = await apiClientAdministration.get(
                `/GET/empleados/${updateSaleDto.updatedBy.employeeId}`,
              );
              if (employee.data.empleado) {
                updateSaleDto.updatedBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
              } else {
                successful = false;
              }
            } catch (_) {
              successful = false;
            }
          }

          if (needsUpdateCreatedBy) {
            try {
              const employee = await apiClientAdministration.get(
                `/GET/empleados/${updateSaleDto.createdBy.employeeId}`,
              );
              if (employee.data.empleado) {
                updateSaleDto.createdBy.employeeName = `${employee.data.empleado.nombres} ${employee.data.empleado.apellidos}`;
              } else {
                successful = false;
              }
            } catch (_) {
              successful = false;
            }
          }
        }

        // if (updateSaleDto.paymentMethods) {
        //   if (updateSaleDto.paymentMethods) {
        //     await Promise.all(
        //       updateSaleDto.paymentMethods.map(async (methodItem) => {
        //         try {
        //           const response = await apiClientPayments.get(
        //             `/metodos/obtener/${methodItem.paymentId}`,
        //           );
        //           if (response.data.metodo) {
        //             methodItem.method = response.data.metodo;
        //           } else {
        //             successful = false;
        //           }
        //         } catch (_) {
        //           successful = false;
        //         }
        //       }),
        //     );
        //   }
        // }

        if (!sale.billNumber && updateSaleDto.paymentMethods) {
          try {
            const metodosPago = updateSaleDto.paymentMethods.map((pm) => ({
              IdMetodo: pm.paymentId,
              Monto: pm.amount,
              ...(pm.bankId && { IdBanco: pm.bankId }),
              ...(pm.cardNumber && { Notarjeta: pm.cardNumber }),
            }));

            const responseTransaction = await apiClientPayments.post(
              `/transaccion/crear/`,
              {
                Nit: updateSaleDto.customer.nit,
                IdCaja: updateSaleDto.cashRegisterId,
                IdServicioTransaccion: 3002,
                Detalle: [
                  {
                    Producto: sale.fuel.fuelName,
                    Cantidad: sale.consumedQuantity,
                    Precio: sale.fuel.salePriceGalon,
                    Descuento: 0,
                  },
                ],
                MetodosPago: metodosPago,
              },
            );

            if (updateSaleDto.customer) {
              if (updateSaleDto.customer.nit != 'CF') {
                if (responseTransaction.data.factura.cliente) {
                  const customer = responseTransaction.data.factura.cliente;
                  if (customer.idCliente)
                    updateSaleDto.customer.customerId = customer.idCliente;

                  if (customer?.nombreCliente || customer?.apellidoCliente) {
                    const nombre = customer?.nombreCliente ?? '';
                    const apellido = customer?.apellidoCliente ?? '';
                    updateSaleDto.customer.customerName =
                      `${nombre} ${apellido}`.trim();
                  } else {
                    successful = false;
                  }
                }
              }
            }

            const transaction = responseTransaction.data;

            if (transaction.idTransaccion) {
              updateSaleDto.transactionId = transaction.idTransaccion;
            } else {
              successful = false;
            }
            if (transaction.noTransaccion) {
              updateSaleDto.transactionNumber = transaction.noTransaccion;
            } else {
              successful = false;
            }
            if (transaction.noAutorizacion) {
              updateSaleDto.authorizationNumber = transaction.noAutorizacion;
            } else {
              successful = false;
            }
            if (transaction.factura?.noFactura) {
              updateSaleDto.billNumber = transaction.factura.noFactura;
            } else {
              successful = false;
            }
          } catch (_) {
            successful = false;
          }
        } else if (updateSaleDto.customer.nit) {
          if (updateSaleDto.customer.nit != 'CF') {
            try {
              const response = await apiClientPayments.get(
                `/cliente/obtener/${updateSaleDto.customer.nit}`,
              );

              if (response.data.factura.cliente) {
                const customer = response.data.factura.cliente;
                if (customer.idCliente)
                  updateSaleDto.customer.customerId = customer.idCliente;

                if (customer?.nombreCliente || customer?.apellidoCliente) {
                  const nombre = customer?.nombreCliente ?? '';
                  const apellido = customer?.apellidoCliente ?? '';
                  updateSaleDto.customer.customerName =
                    `${nombre} ${apellido}`.trim();
                } else {
                  successful = false;
                }
              }
            } catch (_) {
              successful = false;
            }
          }
        }

        if (successful) {
          updateSaleDto.status = 1;
        } else {
          updateSaleDto.status = 4;
        }

        return await this.saleModel
          .findOneAndUpdate(
            { fuelSaleId: saleId },
            { ...updateSaleDto },
            { new: true },
          )
          .exec();
      } catch (error) {}
    }
  }

  async remove(saleId: string) {
    const sale = await this.saleModel
      .findByIdAndUpdate({ fuelSaleId: saleId }, { status: 0 }, { new: true })
      .exec();

    if (sale.billNumber) {
      try {
        await apiClientPayments.delete(
          `/transaccion/anular/${sale.billNumber}`,
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
    if (!bomb) throw new NotFoundException('Bomba no encontrada');

    await this.bombService.updateStatus(bombId, 3, servedQuantityBomb);

    const duration = Math.floor(5000 * consumedQuantity); // Duration per galon: 5 seconds

    setTimeout(async () => {
      let newStatus = 0;
      if (servedQuantityBomb > 1000) {
        newStatus = 4;
      } else {
        newStatus = 1;
      }
      await this.bombService.updateStatus(bombId, newStatus);
    }, duration);
  }
}
