import { Module } from '@nestjs/common'
import { AlertGateway } from './alert.gateway'
import { AlertService } from './alert.service'
import { AlertController } from './alert.controller'

@Module({
  controllers: [AlertController],
  providers: [AlertGateway, AlertService],
})
export class AlertModule {}
