import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { otpForgotPasswordTemplate } from './email-templates/otp-forgot-password-template';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(private prisma: PrismaService) { }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    await this.prisma.users.update({
      where: { email },
      data: {
        otp: otpHash,
        otp_expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully. Please check your email for the OTP code.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, otp, newPassword } = resetPasswordDto;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.otp !== otpHash || new Date() > user.otp_expires) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otp_expires: null,
      },
    });

    return {
      status: 'success',
      message: 'Password reset successfully. You can now login with your new password.',
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

    const htmlContent = otpForgotPasswordTemplate(otp, email);

    await transporter.sendMail({
      from: '"DigiPena" <no-reply@zenify.my.id>',
      to: email,
      subject: 'DigiPena OTP Reset Password',
      text: `Your Reset Password OTP code is ${otp}`,
      html: htmlContent,
    });
  }

  async verifyOtp(verifOTPDto: VerifyOTPDto): Promise<any> {
    const { email, otp } = verifOTPDto;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP input
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.otp !== otpHash || new Date() > user.otp_expires) {
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    return {
      status: 'success',
      message: 'OTP verified successfully. You can now reset your password.',
    };
  }
}
