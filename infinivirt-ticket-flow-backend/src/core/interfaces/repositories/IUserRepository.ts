import { User } from '../../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(skip?: number, take?: number): Promise<User[]>;
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Promise<User>;
  updateStatus(id: string, isActive: boolean): Promise<User>;
}