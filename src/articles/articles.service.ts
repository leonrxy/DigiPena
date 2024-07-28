import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateArticleDto } from './dto/update-article.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) { }
  async createArticle(user: any, createArticleDto: any) {
    const errors = await validate(createArticleDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Find User
    const getUser = await this.prisma.users.findUnique({
      where: { user_id: user.user_id }
    });
    console.log(getUser)
    //Check Article
    const existingCategory = await this.prisma.article_categories.findUnique({
      where:
        { name: createArticleDto.category_name }
    });

    if (!existingCategory) {
      throw new ConflictException('Article Category not found');
    }

    try {
      const articleData = {
        title: createArticleDto.title,
        content: createArticleDto.content,
        published_at: createArticleDto.published ? new Date() : null
      }
      const newArticle = await this.prisma.articles.create({
        data: {
          ...articleData,
          user: {
            connect: {
              user_id: getUser.user_id
            }
          },
          article_category: {
            connect: {
              article_category_id: existingCategory.article_category_id
            }
          }
        }

      });
      return {
        status: "success",
        message: 'Article created successfully',
        data: newArticle
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create Article');
    }
  }

  async findAllArticles(params: {
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
            { title: { contains: search } },
          ]
        })
      };
      // Calculate total data
      const totalData = await this.prisma.articles.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const articles = await this.prisma.articles.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          article_id: true,
          title: true,
          content: true,
          image_path: true,
          published_at: true,
          article_category: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              username: true,
              user_profiles: {
                select: {
                  first_name: true,
                  last_name: true,
                  profile_image_path: true
                }
              }
            }
          },
          created_at: true,
          updated_at: true
        }
      });
      return {
        status: "success",
        message: 'Article retrieved successfully',
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

  async findAllMyArticle(user: any, params: {
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
        user_id: user.user_id,
        ...(search && {
          OR: [
            { title: { contains: search } },
          ]
        })
      };
      // Calculate total data
      const totalData = await this.prisma.articles.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const articles = await this.prisma.articles.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          article_id: true,
          title: true,
          content: true,
          image_path: true,
          published_at: true,
          article_category: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              username: true,
              user_profiles: {
                select: {
                  first_name: true,
                  last_name: true,
                  profile_image_path: true
                }
              }
            }
          },
          created_at: true,
          updated_at: true
        }
      });
      return {
        status: "success",
        message: 'Article retrieved successfully',
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

  async findArticleById(article_id: string) {
    const articles = await this.prisma.articles.findUnique({
      where: { article_id },
      select: {
        article_id: true,
        title: true,
        content: true,
        image_path: true,
        published_at: true,
        article_category: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            username: true,
            user_profiles: {
              select: {
                first_name: true,
                last_name: true,
                profile_image_path: true
              }
            }
          }
        },
        created_at: true,
        updated_at: true
      }
    });

    if (!articles) {
      throw new NotFoundException(`Article with ID ${article_id} not found`);
    }
    try {
      return {
        status: "success",
        data: articles
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve articles');
    }
  }

  async updateArticle(user: any, article_id: string, updateArticleDto: UpdateArticleDto) {
    const errors = await validate(updateArticleDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const exisitingArticle = await this.prisma.articles.findUnique({
      where: { article_id, user_id: user.user_id }
    });

    if (!exisitingArticle) {
      throw new NotFoundException(`Article with ID ${article_id} not found`);
    }

    const existingCategory = await this.prisma.article_categories.findUnique({
      where:
        { name: updateArticleDto.category_name }
    });

    if (!existingCategory) {
      throw new ConflictException('Article Category not found');
    }

    try {
      const articleData = {
        title: updateArticleDto.title,
        content: updateArticleDto.content,
        published_at: updateArticleDto.published ? new Date() : null
      }
      const updatedPositionLevel = await this.prisma.articles.update({
        where: { article_id },
        data: {
          ...articleData,
          article_category: {
            connect: {
              article_category_id: existingCategory.article_category_id
            }
          },
          user: {
            connect: {
              user_id: user.user_id
            }
          }
        }
      });

      return {
        status: "success",
        message: 'Article updated successfully',
        data: updatedPositionLevel
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update Article');
    }
  }

  async removeArticle(user: any, article_id: string) {
    const exisitingArticle = await this.prisma.articles.findUnique({
      where: { article_id, user_id: user.user_id }
    });

    if (!exisitingArticle) {
      throw new NotFoundException(`Article with ID ${article_id} not found`);
    }
    try {
      await this.prisma.articles.delete({
        where: { article_id, user_id: user.user_id }
      });

      return {
        status: "success",
        message: 'Article removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove Article');
    }
  }
}
