/**
 * Nombre de los roles del sistema.
 */
export type RoleName = 'ADMIN' | 'SUPPORT_AGENT' | 'SUPERVISOR';

/**
 * Entidad de dominio que representa el rol de un usuario.
 */
export interface Role {
  id: string;
  name: RoleName;
  description?: string | null;
  createdAt: Date;
}