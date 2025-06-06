import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ArticleLikesService {
  constructor(private prisma: PrismaService) {}

  async likeArticle(user: any, article_id: string) {
    const article = await this.prisma.articles.findUnique({
      where: { article_id },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const existing = await this.prisma.article_likes.findFirst({
      where: { article_id, user_id: user.user_id },
    });
    if (existing) {
      throw new ConflictException('You have already liked this article');
    }

    try {
      const like = await this.prisma.article_likes.create({
        data: {
          article: { connect: { article_id } },
          user: { connect: { user_id: user.user_id } },
        },
      });
      return {
        status: 'success',
        message: 'Article liked successfully',
        data: like,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to like article');
    }
  }

  async unlikeArticle(user: any, article_id: string) {
    const existing = await this.prisma.article_likes.findFirst({
      where: { article_id, user_id: user.user_id },
    });
    if (!existing) {
      throw new NotFoundException('Like not found');
    }
    try {
      await this.prisma.article_likes.delete({
        where: { article_like_id: existing.article_like_id },
      });
      return { status: 'success', message: 'Article unliked successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to unlike article');
    }
  }

  async countArticleLikes(article_id: string) {
    const article = await this.prisma.articles.findUnique({
      where: { article_id },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    const count = await this.prisma.article_likes.count({
      where: { article_id },
    });
    return { status: 'success', data: { likes: count } };
  }
}
