export type ActionResponse<T = unknown> = {
    data?: T
  error?: string;
  success: boolean;
  message: string;
};


