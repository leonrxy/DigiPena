import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { ArticleCategoriesModule } from './article-categories/article-categories.module';
import { ArticleCommentsModule } from './article-comments/article-comments.module';
import { ArticleLikesModule } from './article-likes/article-likes.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'public'),
    serveRoot: '/public',
    serveStaticOptions: { index: false },
  }), ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development' || '.env',
    isGlobal: true,
  }),
    PrismaModule,
    AuthModule,
    ArticlesModule,
    ArticleCategoriesModule,
    ArticleCommentsModule,
    ArticleLikesModule,
    ProfileModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
