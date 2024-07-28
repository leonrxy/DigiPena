import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async findAllUsers(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = {
        published_at: {
          not: null
        },
        ...(search && {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
            { user_profiles: { first_name: { contains: search } } },
            { user_profiles: { last_name: { contains: search } } }
          ]
        })
      };
      // Calculate total data
      const totalData = await this.prisma.users.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const articles = await this.prisma.users.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
          user_profiles: {
            select: {
              user_profile_id: true,
              first_name: true,
              last_name: true,
              profile_image_path: true
            }
          }
        }
      });
      return {
        status: "success",
        message: 'Users retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: articles
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve Article Categorys');
    }
  }

  async getDetailUser(user_id: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { user_id },
        include: {
          user_profiles: true,
          articles: {
            select: {
              article_id: true,
              title: true,
              content: true,
              published_at: true,
              article_category: {
                select: {
                  article_category_id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      return {
        status: "success",
        message: 'User retrieved successfully',
        data: user
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve User');
    }
  }

}
