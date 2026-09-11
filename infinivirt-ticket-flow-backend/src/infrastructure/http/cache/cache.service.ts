import NodeCache from 'node-cache';

// stdTTL: 300 segundos (5 minutos) de vida por defecto en caché.
// checkperiod: Limpia llaves vencidas cada 60 segundos.
const memoryCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export class CacheService {
  // Obtener un valor del caché de memoria
  static get<T>(key: string): T | undefined {
    return memoryCache.get<T>(key);
  }

  // Guardar en caché (key, valor, TTL opcional en segundos)
  static set(key: string, value: any, ttlInSeconds?: number): boolean {
    if (ttlInSeconds !== undefined) {
      return memoryCache.set(key, value, ttlInSeconds);
    }
    return memoryCache.set(key, value);
  }

  // Borrar una llave específica (ej. al hacer logout o actualizar usuario)
  static del(key: string): number {
    return memoryCache.del(key);
  }
}