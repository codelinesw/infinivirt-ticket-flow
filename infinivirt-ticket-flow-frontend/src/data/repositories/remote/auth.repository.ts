import { HttpRequestWrapper } from '../../http/http-request-wrapper'; // Ajusta la ruta a tu wrapper
// import { LoginDto, AuthUserResponse, LoginResponse } from './types/auth.types';

export class AuthRepository {
  
  private http: HttpRequestWrapper;
  private readonly baseUrl = '/api/v1/auth';

  constructor() {
    this.http = new HttpRequestWrapper();
  }

  /**
   * POST /api/v1/auth/login
   * Inicia sesión con email y contraseña
   */
  async login(credentials: any): Promise<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  /**
   * GET /api/v1/auth/me
   * Obtiene la información del usuario autenticado
   */
  async getMe(): Promise<any> {
    return this.http.get<any>(`${this.baseUrl}/me`);
  }

  /**
   * POST /api/v1/auth/logout
   * Cierra la sesión activa
   */
  async logout(): Promise<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {});
  }
}