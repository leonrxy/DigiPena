import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { validate } from 'class-validator';
import { otpEmailTemplate } from './email-templates/otp-email-template';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,) { }

  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
    const errors = await validate(registerUserDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { email, username, first_name, last_name, password } = registerUserDto;

    // Check if email is already registered
    const userEmail = await this.prisma.users.findUnique({
      where: { email },
    });
    if (userEmail) {
      throw new ConflictException('Email is already registered in this platform. Please login instead.');
    }

    // Check if username is already registered
    const userUsername = await this.prisma.users.findUnique({
      where: { username },
    });
    if (userUsername) {
      throw new ConflictException('Username is already registered in this platform. Please use another username.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (userEmail) {
      if (userEmail.verified === false) {
        await this.prisma.users.update({
          where: { user_id: userEmail.user_id },
          data: {
            email,
            username,
            password: hashedPassword,
            otp: otpHash,
            otp_expires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
            user_profiles: {
              update: { first_name, last_name }
            }
          },
        });
      }
    } else {
      await this.prisma.users.create({
        data: {
          email,
          username,
          password: hashedPassword,
          otp: otpHash,
          otp_expires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          user_profiles: {
            create: { first_name, last_name }
          }
        },
      });
    }

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully.Please check your email for the OTP code.',
    };
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = otpEmailTemplate(otp, email);

    await transporter.sendMail({
      from: '"DigiPena" <no-reply@zenify.my.id>',
      to: email,
      subject: 'DigiPena OTP Verification Code',
      text: `Your OTP code is ${otp}`,
      html: htmlContent,
    });
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP input
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user) {
      if (user.otp !== otpHash || new Date() > user.otp_expires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }

      // Update user verification
      await this.prisma.users.update({
        where: { email },
        data: {
          verified: true,
          otp: null,
          otp_expires: null,
        },
      });
    }

    // Create payload and generate token
    const payload = { user_id: user.user_id, email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    // Remove sensitive information
    const detailUser = Object.fromEntries(
      Object.entries(user).filter(([key]) => !['otp', 'otp_expires', 'password', 'updated_at', 'created_at'].includes(key))
    );

    return {
      status: 'success',
      message: 'Email verified successfully.',
      data: {
        token: token,
        user: detailUser
      }
    };
  }

}
