import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express' // 导入 Express 的 Request 类型
import { TicketService } from './ticket.service'
import { CreateTicketDto } from './dto/create-ticket.dto'

// 定义一个扩展的 Request 接口
interface AuthRequest extends Request {
  user: {
    userId: string
    username: string
    role: string
  }
}

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() dto: CreateTicketDto, @Req() req: AuthRequest) {
    return this.ticketService.create(dto, req.user.userId)
  }

  @Get()
  findAll() {
    return this.ticketService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id)
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ticketService.updateStatus(id, status)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id)
  }
}
