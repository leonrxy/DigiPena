import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
import { UpdateArticleCategoryDto } from './dto/update-article-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('article-categories')
@Controller('article-categories')
export class ArticleCategoriesController {
  constructor(private readonly articleCategoriesService: ArticleCategoriesService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['admin']))
  @ApiOperation({ summary: 'Create article category' })
  async create(@Body() createArticleCategoryDto: CreateArticleCategoryDto) {
    return this.articleCategoriesService.create(createArticleCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all article categories' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc') {
    return this.articleCategoriesService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':article_category_id')
  @ApiOperation({ summary: 'Get article category by id' })
  async findOne(@Param('article_category_id') article_category_id: string) {
    return this.articleCategoriesService.findOne(article_category_id);
  }

  @Put(':article_category_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['admin']))
  @ApiOperation({ summary: 'Update article category by id' })
  async update(@Param('article_category_id') article_category_id: string, @Body() updateArticleCategoryDto: UpdateArticleCategoryDto) {
    return this.articleCategoriesService.update(article_category_id, updateArticleCategoryDto);
  }

  @Delete(':article_category_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['admin']))
  @ApiOperation({ summary: 'Delete article category by id' })
  remove(@Param('article_category_id') article_category_id: string) {
    return this.articleCategoriesService.remove(article_category_id);
  }
}
