import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@ApiTags('auth-register')
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Register a user digipena' })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.registerService.registerUser(registerUserDto);
  }

  @Post('verify-otp')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Verify OTP' })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOTPDto): Promise<string> {
    return this.registerService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
}
