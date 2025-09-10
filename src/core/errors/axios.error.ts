// utils/handleAxiosError.ts
import type { AxiosError } from 'axios'

/**
 * Extracts a human-readable error message from an Axios error object.
 * @param error - Unknown error thrown from an Axios call
 * @returns A string message (default fallback included)
 */
export const getAxiosErrorMessage = (error: unknown): string => {
  if (isAxiosErrorWithMessage(error)) {
    return error.response?.data.message || 'An unknown error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

/**
 * Type guard to check if error is an AxiosError with a message
 */
const isAxiosErrorWithMessage = (
  error: unknown,
): error is AxiosError<{ message: string }> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  )
}
