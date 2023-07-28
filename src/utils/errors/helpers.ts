import { AxiosError } from 'axios';

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).response !== undefined;
}

export function unWrapAxiosError<T>(error: AxiosError<T>): T | undefined {
  return error.response?.data;
}

export function unWrapAuthError(error: AxiosError<{} | unknown> | undefined): string {
  if (error === undefined) {
    return 'Something went wrong, please try again';
  }

  if (error.response === undefined) {
    return error.message;
  }

  if (error.response.status === 401) {
    return 'Invalid credentials, please try again';
  }

  return 'Something went wrong, please try again';
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined;
}
