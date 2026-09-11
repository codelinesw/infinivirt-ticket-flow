import { Client } from '@prisma/client';

export interface IClientsRepository {
  create(data: CreateClientDTO): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findAll(params?: { skip?: number; take?: number; isActive?: boolean }): Promise<{ items: Client[]; total: number }>;
  update(id: string, data: UpdateClientDTO): Promise<Client>;
  toggleActive(id: string, isActive: boolean): Promise<Client>;
}