export interface CreateClientDTO {
  name: string;
  email: string;
  phone?: string | null;
  domain?: string | null;
  isActive?: boolean;
}

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string | null;
  domain?: string | null;
  isActive?: boolean;
}