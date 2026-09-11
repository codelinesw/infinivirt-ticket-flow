import bcrypt from 'bcryptjs';
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { AppError } from '../errors/AppError';
import { JwtService } from '../../infrastructure/security/jwt.service';
import { LoginDTO } from '../../infrastructure/http/validators/auth.validator';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(credentials: LoginDTO) {
    const user = await this.userRepository.findByEmail(credentials.email);

    // Mensaje genérico para prevenir enumeración de usuarios
    if (!user || !user.isActive) {
      throw new AppError('Credenciales inválidas o cuenta inactiva', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas o cuenta inactiva', 401, 'INVALID_CREDENTIALS');
    }

    const token = JwtService.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role?.name || 'SUPPORT_AGENT',
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role?.name,
      },
    };
  }

  // Método nuevo: Obtener perfil completo del usuario autenticado
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new AppError('Usuario no encontrado o inactivo', 404, 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role?.name,
      createdAt: user.createdAt,
    };
  }
}