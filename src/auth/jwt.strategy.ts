import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private prisma: PrismaService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.users.findUnique({ where: { user_id: payload.user_id } });

        if (!user) {
            throw new UnauthorizedException("Token is invalid. Please log in again.");
        }
        // const tokenIssuedAt = new Date(payload.iat * 1000).getTime();
        // const passwordChangedAt = new Date(user.password_changed_at).getTime();
        // if (tokenIssuedAt < passwordChangedAt) {
        //     throw new UnauthorizedException("Token is invalid. Please log in again.");
        // }
        return payload

    }
}