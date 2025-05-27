import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { CreateSaleDto } from 'src/sale/dto/create-sale.dto';
import { SaleService } from 'src/sale/sale.service';
import { BombService } from './bomb.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BombGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => SaleService))
    private readonly saleService: SaleService,
    @Inject(forwardRef(() => BombService))
    private readonly bombService: BombService,
  ) {}

  //Send notification to frontend (status updated)
  sendStatusUpdate(bombId: string, status: number, data?: CreateSaleDto) {
    this.server.emit('bombStatusUpdated', { bombId, status, data });
    //console.log('Bomb status updated:', { bombId, status, data });
  }

  //Receive message from the frontend to release the fuel bomb
  @SubscribeMessage('releaseBomb')
  async handleReleaseBomb(
    @MessageBody()
    payload: {
      bombId: string;
      maxTime?: number;
      saleId: string;
      fuelId: string;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { bombId, maxTime, saleId, fuelId } = payload;
    //console.log('Received releaseBomb event:', payload);

    try {
      await this.bombService.updateStatus(bombId, 2);

      // Only send maxTime if the number is valid or greater than 0
      const eventPayload: any = { bombId, saleId, fuelId };
      if (typeof maxTime === 'number' && maxTime > 0) {
        eventPayload.maxTime = maxTime;
      }

      this.server.emit('bombReleasedFromWeb', eventPayload);

      console.log('Emitted bombReleasedFromWeb:', eventPayload);
    } catch (error) {
      console.error('Error al procesar releaseBomb:', error.message);
    }
  }

  //Send notification to frontend (bomb in use)
  @SubscribeMessage('bombInUse')
  handleBombInUse(@MessageBody() data: { bombId: string; status: number }) {
    this.server.emit('bombStatusUpdated', data);
  }

  sendTotalTimeUpdate(saleId: string, totalTime: number) {
    this.server.emit('totalTimeUpdated', { saleId, totalTime });
    //console.log('totalTimeUpdated emitido:', { saleId, totalTime });
  }

  //Receive message from the frotend to set the bomb to maintenance
  @SubscribeMessage('setBombToMaintenance')
  async handleMaintenance(
    @MessageBody() payload: { bombId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { bombId } = payload;

    try {
      // Change bomb status to 4 (IN MAINTENANCE)
      await this.bombService.updateStatus(bombId, 4);

      // Emit WebSocket event to notify to the frontend
      this.server.emit('bombStatusUpdated', {
        bombId,
        status: 4,
      });

      // Send event to python
      this.server.emit('bombInMaintenance', {
        bombId,
      });

      console.log(`[WS] Bomba ${bombId} puesta en mantenimiento.`);
    } catch (error) {
      console.error('Error al poner bomba en mantenimiento:', error.message);
    }
  }

  //Receive message from the frotend to reset the bomb
  @SubscribeMessage('setResetBombToBlocked')
  async handleReset(
    @MessageBody() payload: { bombId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { bombId } = payload;

    try {
      // Change bomb status to 4 (IN MAINTENANCE)
      await this.bombService.updateStatus(bombId, 1);

      // Emit WebSocket event to notify to the frontend
      this.server.emit('bombStatusUpdated', {
        bombId,
        status: 1,
      });

      // Send event to python
      this.server.emit('resetBomb', {
        bombId,
      });

      console.log(`[WS] Bomba ${bombId} reseteada, puesta en bloqueada.`);
    } catch (error) {
      console.error('Error al resetear bomba:', error.message);
    }
  }
}
