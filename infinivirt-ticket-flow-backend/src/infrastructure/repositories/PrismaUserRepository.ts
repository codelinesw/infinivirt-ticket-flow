import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { User } from '../../core/entities/User';
import { prisma } from '../database/prisma/PrismaClient';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!rawUser) return null;

    return {
      id: rawUser.id,
      roleId: rawUser.roleId,
      role: rawUser.role,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      email: rawUser.email,
      passwordHash: rawUser.passwordHash,
      isActive: rawUser.isActive,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!rawUser) return null;

    return {
      id: rawUser.id,
      roleId: rawUser.roleId,
      role: rawUser.role,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      email: rawUser.email,
      passwordHash: rawUser.passwordHash,
      isActive: rawUser.isActive,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    };
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    const rawUsers = await prisma.user.findMany({
      skip,
      take,
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });

    return rawUsers.map(rawUser => ({
      id: rawUser.id,
      roleId: rawUser.roleId,
      role: rawUser.role,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      email: rawUser.email,
      passwordHash: rawUser.passwordHash,
      isActive: rawUser.isActive,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    }));
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Promise<User> {
    const rawUser = await prisma.user.create({
      data: {
        roleId: data.roleId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: data.passwordHash,
        isActive: data.isActive,
      },
      include: { role: true },
    });

    return rawUser as User;
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    const rawUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      include: { role: true },
    });

    return rawUser as User;
  }
}