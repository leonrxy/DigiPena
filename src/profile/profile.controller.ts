import { BadRequestException, Body, Controller, Get, Param, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiTags('profile')
  @Get('my-profile')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  async getMyProfile(@Request() req) {
    return this.profileService.getMyProfile(req.user);
  }

  @ApiTags('profile')
  @Get('profile/id/:user_id')
  @ApiOperation({ summary: 'Get profile by user id' })
  async getProfileById(@Param('user_id') user_id: string) {
    return this.profileService.getProfileById(user_id);
  }

  @ApiTags('profile')
  @Get('profile/:username')
  @ApiOperation({ summary: 'Get profile by user username' })
  async getProfileByUsername(@Param('username') username: string) {
    console.log(username);
    return this.profileService.getProfileByUsername(username);
  }

  @ApiTags('profile')
  @Put('my-profile')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update my profile' })
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @UseInterceptors(FileInterceptor('profile_image', {
    storage: diskStorage({
      destination: './public/uploads/images/profiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `profile-images-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Only image (jpg, jpeg, png) files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async updateMyProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto, @UploadedFile() profile_image?: Express.Multer.File) {
    const updatedProfileDto = Object.fromEntries(
      Object.entries(updateProfileDto).filter(([key]) => !['profile_image'].includes(key))
    );
    return this.profileService.updateMyProfile(req.user, updatedProfileDto, profile_image);
  }

}
