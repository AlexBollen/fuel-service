import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BombGateway {
  @WebSocketServer()
  server: Server;

  //Send notification to frontend (status updated)
  sendStatusUpdate(bombId: string, status: number) {
    this.server.emit('bombStatusUpdated', { bombId, status });
  }

  //Receive message from the frontend to release the fuel bomb
  @SubscribeMessage('releaseBomb')
  handleReleaseBomb(@MessageBody() data: { bombId: string }) {
    const { bombId } = data;
    this.sendStatusUpdate(bombId, 2); //Change status to 2 (released bomb)
    this.server.emit('bombReleasedFromWeb', { bombId }); //emit to the python client
  }

  //Send notification to frontend (bomb in use)
  @SubscribeMessage('bombInUse')
  handleBombInUse(@MessageBody() data: { bombId: string; status: number }) {
    const { bombId } = data;
    this.sendStatusUpdate(bombId, 3);
    this.server.emit('bombStatusUpdated', data);
  }
}
