import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateArticleDto } from './dto/update-article.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) { }
  async createArticle(user: any, createArticleDto: any, article_image: Express.Multer.File) {
    const errors = await validate(createArticleDto);
    if (errors.length > 0) {
      article_image ? await fs.unlink(article_image.path) : null;
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
      article_image ? await fs.unlink(article_image.path) : null;
      throw new ConflictException('Article Category not found');
    }

    try {
      const articleData = {
        title: createArticleDto.title,
        content: createArticleDto.content,
        image_path: article_image ? article_image.path : null,
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
      article_image ? await fs.unlink(article_image.path) : null;
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
        article_comments: {
          select: {
            comment: true,
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

  async updateArticle(user: any, article_id: string, updateArticleDto: UpdateArticleDto, article_image: Express.Multer.File) {
    const errors = await validate(updateArticleDto);
    if (errors.length > 0) {
      article_image ? await fs.unlink(article_image.path) : null;
      throw new BadRequestException(errors);
    }

    const exisitingArticle = await this.prisma.articles.findUnique({
      where: { article_id, user_id: user.user_id }
    });

    if (!exisitingArticle) {
      article_image ? await fs.unlink(article_image.path) : null;
      throw new NotFoundException(`Article with ID ${article_id} not found`);
    }

    const existingCategory = await this.prisma.article_categories.findUnique({
      where:
        { name: updateArticleDto.category_name }
    });

    if (!existingCategory) {
      article_image ? await fs.unlink(article_image.path) : null;
      throw new ConflictException('Article Category not found');
    }

    // Simpan article image saat ini
    const currentArticleImage = exisitingArticle.image_path;

    try {
      // Hapus file image lama jika file baru diunggah dan image lama ada
      if (article_image && currentArticleImage) {
        const oldFilePath = join(currentArticleImage);
        await fs.unlink(oldFilePath);
      }

      const articleData = {
        title: updateArticleDto.title,
        content: updateArticleDto.content,
        image_path: article_image ? article_image.path : currentArticleImage,
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
      article_image ? await fs.unlink(article_image.path) : null;
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

  async updateArticleByAdmin(article_id: string, updateArticleDto: UpdateArticleDto) {
    const errors = await validate(updateArticleDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const exisitingArticle = await this.prisma.articles.findUnique({
      where: { article_id }
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

  async removeArticleByAdmin(article_id: string) {
    const exisitingArticle = await this.prisma.articles.findUnique({
      where: { article_id }
    });

    if (!exisitingArticle) {
      throw new NotFoundException(`Article with ID ${article_id} not found`);
    }
    try {
      await this.prisma.articles.delete({
        where: { article_id }
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
