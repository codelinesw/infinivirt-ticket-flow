import type { CreateUserRequestDto } from "../Request/CreateUserRequestDto";

export interface UserResponse extends CreateUserRequestDto {
  id: string;
  isActive: boolean;
  createdAt: string;
}