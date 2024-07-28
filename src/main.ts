import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  app.useGlobalPipes(new ValidationPipe());
  //app.use('/public', new StaticFilesMiddleware().use);
  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
    credentials: true,
  });
  // Swagger Configuration

  const config = new DocumentBuilder()
    .setTitle('DigiPena API')
    .setDescription('DigiPena is an innovative online platform designed to deliver a seamless reading experience for a diverse range of articles. It offers a user-friendly interface for readers to explore, read, and share high-quality content across various categories. The platform aims to connect authors with a wide audience, promoting the free exchange of knowledge and ideas.')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  document.info.contact = {
    name: 'the developer',
    email: 'leonardusreka@gmail.com',
  };

  document.servers = [
    {
      url: `http://localhost:${port}`,
      description: 'Development Server',
    }
  ];
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
