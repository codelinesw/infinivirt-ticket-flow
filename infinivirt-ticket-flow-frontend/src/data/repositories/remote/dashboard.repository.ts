import { HttpRequestWrapper } from '../../http/http-request-wrapper';

export class DashboardRepository {

    private http: HttpRequestWrapper;
    private readonly baseUrl = '/api/v1/dashboard';

    constructor() {
        this.http = new HttpRequestWrapper();
    }

    /**
     * GET /api/v1/clients/:id
     * Obtiene la información del resumen de los tickets
    */
    async getSummary(): Promise<any> {
        return this.http.get<any>(this.baseUrl+"/summary");
    }

}