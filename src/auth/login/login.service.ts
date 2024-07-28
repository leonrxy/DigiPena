import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class LoginService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,) { }

    async validateUser(LoginUserDto: LoginUserDto): Promise<any> {
        const user = await this.prisma.users.findUnique({ where: { email: LoginUserDto.email } });
        if (!user || user.verified === false) {
            throw new NotFoundException('User not found. Please register to create an account.');
        }
        if (!(await bcrypt.compareSync(LoginUserDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async login(user: any) {
        const payload = { user_id: user.user_id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(
            Object.entries(user).filter(([key]) => !['otp', 'otp_expires', 'password', 'updated_at', 'created_at'].includes(key))
        );
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                token: token,
                user: detailUser
            }
        };
    }

    async getUser(user: any) {
        const users = await this.prisma.users.findUnique({ where: { user_id: user.user_id } });
        if (!users) {
            throw new NotFoundException('Token not found!');
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
