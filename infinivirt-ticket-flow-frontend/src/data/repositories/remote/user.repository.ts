import { HttpRequestWrapper } from '../../http/http-request-wrapper';
// import { CreateUserDto, UpdateUserStatusDto, UserResponse } from './types/user.types';

export class UserRepository {

    private http: HttpRequestWrapper;
    private readonly baseUrl = '/api/v1/users';

    constructor() {
        this.http = new HttpRequestWrapper();
    }


    /**
     * GET /api/v1/users
     * Obtiene todos los usuarios registrados
     */
    async getUsers(): Promise<any> {
        return this.http.get<any>(this.baseUrl);
    }

    /**
     * POST /api/v1/users
     * Registra un nuevo usuario
     */
    async createUser(userData: any): Promise<any> {
        return this.http.post<any>(this.baseUrl, userData);
    }

    /**
     * PATCH /api/v1/users/:id/status
     * Actualiza el estado (activo/inactivo) de un usuario
     */
    async updateUserStatus(id: string | number, statusData: any): Promise<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/status`, statusData);
    }
}