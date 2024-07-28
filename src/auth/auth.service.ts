import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,) { }

    async getUser(user: any) {
        const users = await this.prisma.users.findUnique({ where: { user_id: user.user_id } });
        if (!users) {
            throw new HttpException({ status: "failed", message: 'Token not found!' }, HttpStatus.NOT_FOUND);
        }
        const detailUser = Object.fromEntries(
            Object.entries(users).filter(([key]) => !['otp', 'otp_expires', 'password', 'updated_at', 'created_at'].includes(key))
        );
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                user: detailUser
            }
        };
    }

}
