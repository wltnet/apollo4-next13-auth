import { Errors } from '@/types/form';

export const showErrorMessage = (errors: Errors[], name: string) => {
  const hasError = errors.find((error) => error.name === name);
  return hasError ? hasError.message : null;
}
