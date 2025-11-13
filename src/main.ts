/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule , DocumentBuilder } from '@nestjs/swagger';
import  * as express from "express"
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule , {cors : true});
  // Expose uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // rezo pay 
    app.use(
    express.json({
      verify: (req: any, res, buf) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        req.rawBody = buf;
      },
    }),
  );


  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API documentation for the Blog App')
    .setVersion('1.0')
    .addBearerAuth() // for JWT protected routes
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // URL = http://localhost:3000/api-docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
        