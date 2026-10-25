export type ActionState<T = unknown> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};
