import { Module } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleCommentsController } from './article-comments.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArticleCommentsController],
  providers: [ArticleCommentsService],
})
export class ArticleCommentsModule { }
