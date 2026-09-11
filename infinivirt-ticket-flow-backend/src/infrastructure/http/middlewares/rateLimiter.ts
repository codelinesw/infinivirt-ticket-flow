import rateLimit from 'express-rate-limit';

/**
 * Configuración global de restricción de peticiones por IP.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 100, // Máximo 100 solicitudes por IP por ventana
  standardHeaders: true, // Devuelve información del límite en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Deshabilita cabeceras antiguas `X-RateLimit-*`
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Ha excedido el límite de solicitudes permitidas. Intente más tarde.',
    },
  },
});