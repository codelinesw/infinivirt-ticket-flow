import type { CreateTicketRequestDto } from "../Request/CreateTicketRequestDto";

export interface TicketResponse extends CreateTicketRequestDto {
  id: string;
  status: string;
  createdAt: string;
}