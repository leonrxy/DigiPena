import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticleBookmarksService } from './article-bookmarks.service';

@ApiTags('article-bookmarks')
@Controller('article/bookmarks')
export class ArticleBookmarksController {
  constructor(private readonly articleBookmarksService: ArticleBookmarksService) {}

  @Post(':article_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Bookmark article' })
  bookmarkArticle(@Request() req, @Param('article_id') article_id: string) {
    return this.articleBookmarksService.bookmarkArticle(req.user, article_id);
  }

  @Delete(':article_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Unbookmark article' })
  unbookmarkArticle(@Request() req, @Param('article_id') article_id: string) {
    return this.articleBookmarksService.unbookmarkArticle(req.user, article_id);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Get my bookmarked articles' })
  getBookmarks(@Request() req) {
    return this.articleBookmarksService.getBookmarks(req.user);
  }

  @Get(':article_id')
  @ApiOperation({ summary: 'Get bookmarks count for article' })
  countBookmarks(@Param('article_id') article_id: string) {
    return this.articleBookmarksService.countArticleBookmarks(article_id);
  }
}
