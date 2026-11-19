import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { TicketModule } from './ticket/ticket.module'
import { AlertModule } from './alert/alert.module'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TicketModule,
    AlertModule, // 引入告警模块
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
