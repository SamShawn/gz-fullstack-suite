import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

// 定义告警数据的强类型
interface AlertPayload {
  id: string
  level: string
  message: string
  timestamp: Date
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/alerts',
})
export class AlertGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private logger = new Logger('AlertGateway')

  handleConnection(client: Socket) {
    this.logger.log(`客户端已连接: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`客户端断开连接: ${client.id}`)
  }

  // 广播告警消息给所有连接的客户端
  broadcastAlert(alert: AlertPayload) {
    this.server.emit('new-alert', alert)
  }
}
