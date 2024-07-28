import { Controller, Post, Body, Param, UseGuards, Request, Get, Put, Delete } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('article-comments')
@Controller('article/comments')
export class ArticleCommentsController {
  constructor(private readonly articleCommentsService: ArticleCommentsService) { }

  @Post(':article_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Create comment in article' })
  async postComment(@Request() req, @Param('article_id') article_id: string, @Body() createArticleCommentDto: CreateArticleCommentDto) {
    return this.articleCommentsService.postComment(req.user, article_id, createArticleCommentDto);
  }

  @Get(':article_id')
  @ApiOperation({ summary: 'Get all comment in article' })
  async getComments(@Param('article_id') article_id: string) {
    return this.articleCommentsService.getComments(article_id);
  }

  @Put(':article_comment_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Update comment in article' })
  async updateComment(@Request() req, @Param('article_comment_id') article_comment_id: string, @Body() updateArticleCommentDto: UpdateArticleCommentDto) {
    return this.articleCommentsService.updateComment(req.user, article_comment_id, updateArticleCommentDto);
  }

  @Delete(':article_comment_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Delete comment in article' })
  async deleteComment(@Request() req, @Param('article_comment_id') article_comment_id: string) {
    return this.articleCommentsService.deleteComment(req.user, article_comment_id);
  }
}
