import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API de Alumnos - Documentación</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function () {
      // Funciona con o sin barra final y con el prefijo del stage (/dev)
      var base = window.location.pathname;
      if (base.endsWith('/')) base = base.slice(0, -1);
      window.ui = SwaggerUIBundle({
        url: base + '/json',
        dom_id: '#swagger-ui',
        persistAuthorization: true,
      });
    };
  </script>
</body>
</html>`;

@ApiExcludeController()
@Controller('docs')
export class DocsController {
  // Aquí se guarda la definición de la API que genera Swagger al arrancar
  static document: object = {};

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  html(): string {
    return HTML;
  }

  @Get('json')
  json() {
    return DocsController.document;
  }
}