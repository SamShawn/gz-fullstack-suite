import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

// 定义 JWT 载荷的强类型
interface JwtPayload {
  sub: string // 用户 ID
  username: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    })
  }

  async validate(payload: JwtPayload) {
    // 这里返回的数据会被挂载到 request.user 上
    return { userId: payload.sub, username: payload.username, role: payload.role }
  }
}
