export type UserRole = "admin" | "member";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type LoginState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  user?: CurrentUser;
  token?: string;
};
