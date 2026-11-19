import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTicketDto } from './dto/create-ticket.dto'

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto, userId: string) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId,
      },
    })
  }

  async findAll() {
    return this.prisma.ticket.findMany({
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { user: { select: { username: true } } },
    })
    if (!ticket) throw new NotFoundException('工单不存在')
    return ticket
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { status },
    })
  }

  async remove(id: string) {
    return this.prisma.ticket.delete({ where: { id } })
  }
}
