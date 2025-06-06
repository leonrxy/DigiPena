import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ArticleLikesService } from './article-likes.service';

@ApiTags('article-likes')
@Controller('article/likes')
export class ArticleLikesController {
  constructor(private readonly articleLikesService: ArticleLikesService) {}

  @Post(':article_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Like article' })
  likeArticle(@Request() req, @Param('article_id') article_id: string) {
    return this.articleLikesService.likeArticle(req.user, article_id);
  }

  @Delete(':article_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['user', 'admin']))
  @ApiOperation({ summary: 'Unlike article' })
  unlikeArticle(@Request() req, @Param('article_id') article_id: string) {
    return this.articleLikesService.unlikeArticle(req.user, article_id);
  }

  @Get(':article_id')
  @ApiOperation({ summary: 'Get likes count for article' })
  countLikes(@Param('article_id') article_id: string) {
    return this.articleLikesService.countArticleLikes(article_id);
  }
}
