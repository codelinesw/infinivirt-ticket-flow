import bcrypt from 'bcryptjs';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { AppError } from '../../infrastructure/http/middlewares/errorHandler';
import { CreateUserDTO } from '../../infrastructure/http/validators/user.validator';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  // Helper interno para limpiar el objeto usuario
  private sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async createUser(data: CreateUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('El correo electrónico ya está registrado', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: data.roleId,
      isActive: true,
    });

    return this.sanitizeUser(newUser);
  }

  async getAllUsers(skip?: number, take?: number) {
    const users = await this.userRepository.findAll(skip, take);
    return users.map(user => this.sanitizeUser(user));
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
    return this.sanitizeUser(user);
  }

  async changeUserStatus(id: string, isActive: boolean) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    const updatedUser = await this.userRepository.updateStatus(id, isActive);
    return this.sanitizeUser(updatedUser);
  }
}