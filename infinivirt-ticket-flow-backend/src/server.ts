import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './infrastructure/database/prisma/PrismaClient';

const PORT = process.env.PORT || 3000;

/**
 * Función encargada de validar conexiones y arrancar el servidor.
 */
async function bootstrap() {
  try {
    // Verificar conexión a la base de datos (MySQL / MariaDB)
    await prisma.$connect();
    console.log(' Conexión exitosa a la base de datos.');

    const server = app.listen(PORT, () => {
      console.log(` Servidor ejecutándose en el puerto ${PORT}`);
      console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

    // Manejo de apagado gradual (Graceful Shutdown)
    const shutdown = async (signal: string) => {
      console.log(`\n Señal ${signal} recibida. Cerrando servidor HTTP y conexiones...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log(' Conexión a la base de datos cerrada.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error(' Error crítico al iniciar el servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();