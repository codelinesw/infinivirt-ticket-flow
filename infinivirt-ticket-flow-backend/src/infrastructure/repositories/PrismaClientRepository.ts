import { prisma } from '../database/prisma/PrismaClient';
import { CreateClientDTO, UpdateClientDTO } from '../../core/DTOs/ClientDTO';
import { IClientsRepository } from '../../core/interfaces/repositories/IClientsRepository';


export class PrismaClientRepository implements IClientsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateClientDTO): Promise<Client> {
    return prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        domain: data.domain ?? null,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { email },
    });
  }

  async findAll(params?: { skip?: number; take?: number; isActive?: boolean }): Promise<{ items: Client[]; total: number }> {
    const where = params?.isActive !== undefined ? { isActive: params.isActive } : {};

    const [items, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: params?.skip ?? 0,
        take: params?.take ?? 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    return { items, total };
  }

  async update(id: string, data: UpdateClientDTO): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.domain !== undefined && { domain: data.domain }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data: { isActive },
    });
  }
}