import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ArticleBookmarksService {
  constructor(private prisma: PrismaService) {}

  async bookmarkArticle(user: any, article_id: string) {
    const article = await this.prisma.articles.findUnique({ where: { article_id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const existing = await this.prisma.article_bookmarks.findFirst({
      where: { article_id, user_id: user.user_id },
    });
    if (existing) {
      throw new ConflictException('You have already bookmarked this article');
    }

    try {
      const bookmark = await this.prisma.article_bookmarks.create({
        data: {
          article: { connect: { article_id } },
          user: { connect: { user_id: user.user_id } },
        },
      });
      return {
        status: 'success',
        message: 'Article bookmarked successfully',
        data: bookmark,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to bookmark article');
    }
  }

  async unbookmarkArticle(user: any, article_id: string) {
    const existing = await this.prisma.article_bookmarks.findFirst({
      where: { article_id, user_id: user.user_id },
    });
    if (!existing) {
      throw new NotFoundException('Bookmark not found');
    }
    try {
      await this.prisma.article_bookmarks.delete({
        where: { article_bookmark_id: existing.article_bookmark_id },
      });
      return { status: 'success', message: 'Article unbookmarked successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to unbookmark article');
    }
  }

  async getBookmarks(user: any) {
    const bookmarks = await this.prisma.article_bookmarks.findMany({
      where: { user_id: user.user_id },
      include: {
        article: {
          select: {
            article_id: true,
            title: true,
            content: true,
            image_path: true,
            published_at: true,
            article_category: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                username: true,
                user_profiles: {
                  select: {
                    first_name: true,
                    last_name: true,
                    profile_image_path: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      status: 'success',
      message: 'Bookmarks retrieved successfully',
      data: bookmarks,
    };
  }

  async countArticleBookmarks(article_id: string) {
    const article = await this.prisma.articles.findUnique({
      where: { article_id },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    const count = await this.prisma.article_bookmarks.count({ where: { article_id } });
    return { status: 'success', data: { bookmarks: count } };
  }
}
