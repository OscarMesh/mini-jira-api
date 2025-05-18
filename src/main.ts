import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EnvironmentSchemaType } from './@types';
import { ConfigService } from '@nestjs/config';
import { allowedHeaders } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Min - Jira API')
    .setDescription('The Min - Jira API specification')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: allowedHeaders(),
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, x-api-key, x-referer-key, Content-Type, Accept, Observe, Authorization, Access-Control-Allow-Origin',
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
  });

  const port = configService.getOrThrow<EnvironmentSchemaType['PORT']>('PORT');
  await app.listen(port);
}
bootstrap();
