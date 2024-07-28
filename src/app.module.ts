import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

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
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
