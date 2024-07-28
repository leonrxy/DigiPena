import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Put, Request, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @ApiTags('articles')
  @ApiTags('articles-management')
  @Get('articles')
  @ApiOperation({ summary: 'Get all article published' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  async findAllArticles(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc') {
    return this.articlesService.findAllArticles({ page, pageSize, search, sortBy, sortOrder });
  }

  @ApiTags('articles')
  @ApiTags('my-articles')
  @Get('articles/:article_id')
  @ApiOperation({ summary: 'Get detail article by id' })
  async findArticleById(@Param('article_id') article_id: string) {
    return this.articlesService.findArticleById(article_id);
  }

  @ApiTags('my-articles')
  @Post('my-articles')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Create article' })
  @UseInterceptors(FileInterceptor('article_image', {
    storage: diskStorage({
      destination: './public/uploads/images/articles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `article-images-${uniqueSuffix}${ext}`;
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
  async createArticle(@Request() req, @Body() createArticleDto: CreateArticleDto, @UploadedFile() article_image?: Express.Multer.File) {
    const updatedArticleDto = Object.fromEntries(
      Object.entries(createArticleDto).filter(([key]) => !['article_image'].includes(key))
    );
    return this.articlesService.createArticle(req.user, updatedArticleDto, article_image);
  }

  @ApiTags('my-articles')
  @Get('my-articles')
  @ApiOperation({ summary: 'Get all my article' })
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  async findAllMyArticle(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc') {
    return this.articlesService.findAllMyArticle(req.user, { page, pageSize, search, sortBy, sortOrder });
  }

  @ApiTags('my-articles')
  @Put('my-articles/:article_id')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Update my article by id' })
  @UseInterceptors(FileInterceptor('article_image', {
    storage: diskStorage({
      destination: './public/uploads/images/articles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `article-images-${uniqueSuffix}${ext}`;
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
  async updateArticle(@Request() req, @Param('article_id') article_id: string, @Body() updateArticleDto: UpdateArticleDto, @UploadedFile() article_image?: Express.Multer.File) {
    const updatedArticleDto = Object.fromEntries(
      Object.entries(updateArticleDto).filter(([key]) => !['article_image'].includes(key))
    );
    return this.articlesService.updateArticle(req.user, article_id, updatedArticleDto, article_image);
  }

  @ApiTags('my-articles')
  @Delete('my-articles/:article_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Delete my article by id' })
  removeArticle(@Request() req, @Param('article_id') article_id: string) {
    return this.articlesService.removeArticle(req.user, article_id);
  }

  @ApiTags('articles-management')
  @Put('articles/management/:article_id')
  @ApiOperation({ summary: 'Update article from user' })
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['admin']))
  async updateArticleByAdmin(
    @Param('article_id') article_id: string,
    @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.updateArticleByAdmin(article_id, updateArticleDto);
  }

  @ApiTags('articles-management')
  @Delete('articles/management/:article_id')
  @ApiOperation({ summary: 'Delete article from user' })
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['admin']))
  async removeArticleByAdmin(@Param('article_id') article_id: string) {
    return this.articlesService.removeArticleByAdmin(article_id);
  }
}
