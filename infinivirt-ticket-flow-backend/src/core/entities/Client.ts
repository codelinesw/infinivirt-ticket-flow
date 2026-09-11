/**
 * Entidad de dominio que representa a la empresa o cliente atendido.
 */
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  domain?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}