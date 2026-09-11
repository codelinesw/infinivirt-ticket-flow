import type { AuthUserResponseDto } from "./AuthUserResponseDto";

export interface LoginResponse {
  accessToken: string;
  user: AuthUserResponseDto;
}