import { HttpRequestWrapper } from '../../http/http-request-wrapper';
// import { CreateTicketDto, AddCommentDto, TicketResponse, CommentResponse } from './types/ticket.types';

export class TicketRepository {

    private http: HttpRequestWrapper;
    private readonly baseUrl = '/api/v1/tickets';

    constructor() {
        this.http = new HttpRequestWrapper();
    }

    /**
     * GET /api/v1/tickets
     * Obtiene todos los tickets
     */
    async getTickets(status?: string, page: number = 1, limit: number = 5): Promise<any> {
        const params = new URLSearchParams();
        if (status) params.append("status",status);
        if (page) params.append("page",page.toString());
        if (limit) params.append("limit",limit.toString());
        return this.http.get<any>(`${this.baseUrl}?${params}`);
    }

    /**
     * GET /api/v1/tickets/:id
     * Obtiene el detalle del ticket buscando por id
     */
    async getTicketDetailById(id: string): Promise<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    /**
     * GET /api/v1/tickets/:id/comments
     * Obtiene el detalle del ticket buscando por id
     */
    async getComments(id: string): Promise<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}/comments`);
    }

    /**
     * POST /api/v1/tickets
     * Crea un nuevo ticket de soporte
     */
    async asignTicket(id: string, ticketData: any): Promise<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/assign`, ticketData);
    }


    /**
     * POST /api/v1/tickets
     * Crea un nuevo ticket de soporte
     */
    async createTicket(ticketData: any): Promise<any> {
        return this.http.post<any>(this.baseUrl, ticketData);
    }

    /**
     * POST /api/v1/tickets/comments
     * Agrega un comentario a un ticket
     */
    async addComment(id: string, commentData: any): Promise<any> {
        return this.http.post<any>(`${this.baseUrl}/${id}/comments`, commentData);
    }

    /**
     * PATCH /api/v1/tickets/comments
     * Agrega un comentario a un ticket
     */
    async updateStatus(id: string, bodyRequest: any): Promise<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/status`, bodyRequest);
    }

}