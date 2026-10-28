import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // FILTRO
import { DocsController } from './docs.controller';

export function configureApp(app: INestApplication): void {
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter()); // FILTRO
  setupSwagger(app);
}

function setupSwagger(app: INestApplication): void {
  const builder = new DocumentBuilder()
    .setTitle('API de Alumnos')
    .setDescription(
      'CRUD y búsqueda de alumnos. Los endpoints requieren el header x-api-key.',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key');

  // En AWS, API Gateway agrega el nombre del stage (ej. /dev) a la URL
  if (process.env.STAGE) {
    builder.addServer(`/${process.env.STAGE}`);
  }

  const document = SwaggerModule.createDocument(app, builder.build());
  // SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: 'docs/json' });
  DocsController.document = document;
}