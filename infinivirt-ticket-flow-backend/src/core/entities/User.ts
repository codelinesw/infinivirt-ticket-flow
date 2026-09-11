import { Role } from './Role';

/**
 * Entidad de dominio para la gestión de usuarios del sistema.
 */
export interface User {
  id: string;
  roleId: string;
  role?: Role;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}