import { HttpRequestWrapper } from '../../http/http-request-wrapper';

export class ClientRepository {

    private http: HttpRequestWrapper;
    private readonly baseUrl = '/api/v1/clients';

    constructor() {
        this.http = new HttpRequestWrapper();
    }

    /**
     * POST /api/v1/clients
     * Registra un nuevo cliente/tenant
     */
    async createClient(clientData: any): Promise<any> {
        return this.http.post<any>(this.baseUrl, clientData);
    }

    /**
     * GET /api/v1/clients
     * Obtiene el listado de clientes/tenants (soporta paginación y filtro de estado)
     */
    async getClients(params?: { page?: number; limit?: number; isActive?: boolean }): Promise<any> {
        return this.http.get<any>(this.baseUrl, { params });
    }

    /**
     * GET /api/v1/clients/:id
     * Obtiene los detalles de un cliente por su ID
     */
    async getClientById(id: string): Promise<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    /**
     * PUT /api/v1/clients/:id
     * Actualiza la información de un cliente
     */
    async updateClient(id: string, clientData: any): Promise<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, clientData);
    }

    /**
     * PATCH /api/v1/clients/:id/status
     * Activa o inhabilita a un cliente lógicamente
     */
    async updateClientStatus(id: string, statusData: { isActive: boolean }): Promise<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/status`, statusData);
    }
}