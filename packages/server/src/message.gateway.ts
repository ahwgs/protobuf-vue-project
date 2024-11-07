import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('MessageGateway');

  handleConnection() {
    this.logger.log('当前websocket 已连接');
  }

  handleDisconnect() {
    this.logger.log('当前websocket 已断开');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    this.logger.log('Server Received message:', data);
    // Handle received message
    this.server.emit('message', data);
  }
}
