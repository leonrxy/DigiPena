import { Body, Controller, HttpCode, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/loginUser.dto';

@ApiTags('auth-login')
@Controller('auth/login')
export class LoginController {
  constructor(private loginService: LoginService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login user' })
  @HttpCode(200)
  async loginJobSeeker(@Body() loginUserDto: LoginUserDto) {
    const user = await this.loginService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } else if (user.verified === 'false') {
      throw new NotFoundException('User not found. Please register to create an account.');
    }
    return this.loginService.login(user);
  }

}