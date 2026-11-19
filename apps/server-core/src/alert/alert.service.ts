import { Injectable, OnModuleInit } from '@nestjs/common'
import { AlertGateway } from './alert.gateway'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AlertService implements OnModuleInit {
  constructor(
    private gateway: AlertGateway,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    // 每 5 秒生成一条模拟告警并推送到前端
    setInterval(async () => {
      const levels = ['INFO', 'WARNING', 'DANGER']
      const level = levels[Math.floor(Math.random() * levels.length)]
      const message = `系统检测到 ${level} 级别异常 - 随机值: ${Math.random().toFixed(2)}`

      // 1. 保存到数据库
      const alert = await this.prisma.alert.create({
        data: { level, message },
      })

      // 2. 广播到前端
      this.gateway.broadcastAlert(alert)
      console.log(`📡 推送告警: [${level}] ${message}`)
    }, 5000)
  }

  async getRecentAlerts() {
    return this.prisma.alert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50, // 只返回最近 50 条，防止数据过大
    })
  }
}
