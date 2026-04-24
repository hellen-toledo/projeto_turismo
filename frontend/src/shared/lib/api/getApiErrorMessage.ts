import axios from 'axios';

interface ValidationErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export const getApiErrorMessage = (error: unknown, fallback = 'Não foi possível concluir a operação.') => {
  if (axios.isAxiosError<ValidationErrorResponse>(error)) {
    const validationErrors = error.response?.data?.errors;

    if (validationErrors) {
      const firstError = Object.values(validationErrors)[0]?.[0];

      if (firstError) {
        return firstError;
      }
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
