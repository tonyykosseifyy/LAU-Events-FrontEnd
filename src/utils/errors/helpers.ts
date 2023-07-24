import { AxiosError } from "axios"

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).response !== undefined
}

export function unWrapAxiosError<T>(error: AxiosError<T>): T | undefined {
  return error.response?.data
}

export function unWrapAuthError(error: AxiosError<{}> | undefined): string {
  return "Auth error"
}

export function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}
