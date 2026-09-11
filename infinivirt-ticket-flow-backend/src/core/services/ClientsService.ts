import { CreateClientDTO, UpdateClientDTO } from '../DTOs/ClientDTO';
import { IClientsRepository } from '../interfaces/repositories/IClientsRepository';
import { Client } from '@prisma/client';

export class ClientsService {
  
  constructor(private readonly clientsRepository: IClientsRepository) {}

  async createClient(data: CreateClientDTO): Promise<Client> {
    const existingClient = await this.clientsRepository.findByEmail(data.email);
    if (existingClient) {
      throw new Error('CLIENT_EMAIL_EXISTS');
    }
    return this.clientsRepository.create(data);
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findById(id);
    if (!client) {
      throw new Error('CLIENT_NOT_FOUND');
    }
    return client;
  }

  async listClients(page = 1, limit = 10, isActive?: boolean) {
    const skip = (page - 1) * limit;
    const { items, total } = await this.clientsRepository.findAll({ skip, take: limit, isActive });

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateClient(id: string, data: UpdateClientDTO): Promise<Client> {
    await this.getClientById(id);

    if (data.email) {
      const existingClient = await this.clientsRepository.findByEmail(data.email);
      if (existingClient && existingClient.id !== id) {
        throw new Error('CLIENT_EMAIL_EXISTS');
      }
    }

    return this.clientsRepository.update(id, data);
  }

  async disableClient(id: string): Promise<Client> {
    await this.getClientById(id);
    return this.clientsRepository.toggleActive(id, false);
  }

  async toggleClientStatus(id: string, isActive: boolean): Promise<Client> {
    await this.getClientById(id);
    return this.clientsRepository.toggleActive(id, isActive);
  }
}