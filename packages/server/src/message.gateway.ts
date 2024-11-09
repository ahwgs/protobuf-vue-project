import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { join } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const protobuf = require('protobufjs');

// 加载 .proto 文件
const root = new protobuf.Root();
root.loadSync(join(__dirname, '..', '/assets/message.proto'));

// 获取 Message 类型
const Message = root.lookupType('Message');
@WebSocketGateway({
  cors: true,
})
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
  handleMessage(@MessageBody() data: Buffer) {
    const message = Message.decode(new Uint8Array(data)) as any;
    this.logger.log('Server Received message buff:', JSON.stringify(message));

    const response = Message.create({
      text: `服务端已收到数据: ${message?.text}`,
    });

    this.logger.log('Server Send message:', JSON.stringify(response));

    // 序列化消息对象，并将其发送给服务器
    const buffer = Message.encode(response).finish();
    this.server.emit('message', buffer);
  }
}
