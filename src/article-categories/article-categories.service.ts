import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { validate } from 'class-validator';

@Injectable()
export class ArticleCategoriesService {
  constructor(private prisma: PrismaService) { }
  async create(createArticleCategoryDto: CreateArticleCategoryDto) {
    const errors = await validate(createArticleCategoryDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Article Category
    const existingCategory = await this.prisma.article_categories.findUnique({
      where:
        { name: createArticleCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Article Category is already taken');
    }
    try {
      const newCategory = await this.prisma.article_categories.create({ data: createArticleCategoryDto });
      return {
        status: "success",
        message: 'Article Category created successfully',
        data: newCategory
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create Article Category');
    }
  }

  async findAll(params: {
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
      const where = search ? {
        OR: [
          { name: { contains: search } },
        ]
      } : {};
      // Calculate total data
      const totalData = await this.prisma.article_categories.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const article_categories = await this.prisma.article_categories.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          article_category_id: true,
          name: true,
          description: true,
          created_at: true,
          updated_at: true
        }
      });
      return {
        status: "success",
        message: 'Article Categories retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: article_categories
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve Article Categorys');
    }
  }

  async findOne(article_category_id: string) {
    const article_categories = await this.prisma.article_categories.findUnique({
      where: { article_category_id },
      select: {
        article_category_id: true,
        name: true,
        description: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!article_categories) {
      throw new NotFoundException(`Article Category with ID ${article_category_id} not found`);
    }
    try {
      return {
        status: "success",
        data: article_categories
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve article categories');
    }
  }

  async update(article_category_id: string, updateArticleCategoryDto: UpdateArticleCategoryDto) {
    const errors = await validate(updateArticleCategoryDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCategory = await this.prisma.article_categories.findUnique({
      where: { article_category_id }
    });

    if (!existingCategory) {
      throw new NotFoundException(`Article Category with ID ${article_category_id} not found`);
    }

    if (updateArticleCategoryDto.name) {
      const existingName = await this.prisma.article_categories.findUnique({
        where: { name: updateArticleCategoryDto.name }
      });

      if (existingName && existingName.article_category_id !== article_category_id) {
        throw new ConflictException('Article Category is already taken');
      }
    }

    try {
      const updatedCategory = await this.prisma.article_categories.update({
        where: { article_category_id },
        data: updateArticleCategoryDto
      });

      return {
        status: "success",
        message: 'Article Category updated successfully',
        data: updatedCategory
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update Article Category');
    }
  }

  async remove(article_category_id: string) {
    const existingCategory = await this.prisma.article_categories.findUnique({
      where: { article_category_id }
    });

    if (!existingCategory) {
      throw new NotFoundException(`Article Category with ID ${article_category_id} not found`);
    }
    try {
      await this.prisma.article_categories.delete({
        where: { article_category_id }
      });

      return {
        status: "success",
        message: 'Article Category removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove Article Category');
    }
  }
}
