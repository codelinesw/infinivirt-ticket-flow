import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

const routesPath = path.resolve(
  __dirname,
  '../infrastructure/http/routes'
);

const routeFiles = fs
  .readdirSync(routesPath)
  .filter((file: any) => file.endsWith('.routes.ts'))
  .map((file: any) => path.join(routesPath, file));

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InfiniVirt Ticket Flow API',
      version: '1.0.0',
      description: 'Documentación de la API con Express, TypeScript y Prisma 6',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', }, }, },
  },
  apis: [
    path.resolve(__dirname, '../app.ts'),
    ...routeFiles,
  ],
};

export const swaggerSpec = swaggerJSDoc(options);