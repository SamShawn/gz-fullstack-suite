import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: '工单标题不能为空' })
  title: string

  @IsString()
  @IsOptional()
  content?: string
}
