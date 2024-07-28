import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }

  async getMyProfile(user: any) {
    const getProfile = await this.prisma.user_profiles.findUnique({
      where: {
        user_id: user.user_id,
      },
    });

    return {
      status: 'success',
      message: 'Profile data has been retrieved successfully',
      data: getProfile,
    }
  }

  async getProfileById(user_id: string) {
    const getProfile = await this.prisma.user_profiles.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (!getProfile) {
      throw new NotFoundException('User profile not found');
    }

    return {
      status: 'success',
      message: 'Profile data has been retrieved successfully',
      data: getProfile,
    }
  }

  async getProfileByUsername(username: string) {
    try {
      const getUser = await this.prisma.users.findUnique({
        where: {
          username: username,
        },
      });

      if (!getUser) {
        throw new NotFoundException('User not found');
      }

      const getProfile = await this.prisma.user_profiles.findUnique({
        where: {
          user_id: getUser.user_id,
        },
        include: {
          user: {
            select: {
              articles: {
                select: {
                  article_id: true,
                  title: true,
                  content: true,
                  published_at: true,
                  image_path: true,
                  created_at: true,
                  updated_at: true,
                  article_category: {
                    select: {
                      name: true,
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!getProfile) {
        throw new NotFoundException('User profile not found');
      }

      return {
        status: 'success',
        message: 'Profile data has been retrieved successfully',
        data: getProfile,
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async updateMyProfile(user: any, updateProfileDto: any, profile_image: Express.Multer.File) {
    const { first_name, last_name, bio, website_url } = updateProfileDto;

    try {
      const getUser = await this.prisma.users.findUnique({
        where: {
          user_id: user.user_id,
        },
      });

      const getProfile = await this.prisma.user_profiles.findUnique({
        where: {
          user_id: getUser.user_id,
        },
      });

      // Simpan profile image saat ini
      const currentProfileImage = getProfile.profile_image_path;

      // Hapus file image lama jika file baru diunggah dan image lama ada
      if (profile_image && currentProfileImage) {
        const oldFilePath = join(currentProfileImage);
        await fs.unlink(oldFilePath);
      }

      const updateProfile = await this.prisma.user_profiles.update({
        where: {
          user_id: getUser.user_id,
        },
        data: {
          first_name,
          last_name,
          bio,
          website_url,
          profile_image_path: profile_image ? profile_image.path : null,
        },
      });

      return {
        status: 'success',
        message: 'Profile data has been updated successfully',
        data: updateProfile,
      }
    } catch (error) {
      console.log(error)
      profile_image ? await fs.unlink(profile_image.path) : null;
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
