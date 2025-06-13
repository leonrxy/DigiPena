import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ArticleBookmarksService } from './article-bookmarks.service';
import { ArticleBookmarksController } from './article-bookmarks.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ArticleBookmarksController],
  providers: [ArticleBookmarksService],
})
export class ArticleBookmarksModule {}
