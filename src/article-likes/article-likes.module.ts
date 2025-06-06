import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ArticleLikesService } from './article-likes.service';
import { ArticleLikesController } from './article-likes.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ArticleLikesController],
  providers: [ArticleLikesService],
})
export class ArticleLikesModule {}
