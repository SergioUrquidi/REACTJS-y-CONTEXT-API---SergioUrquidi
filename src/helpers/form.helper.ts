import z from 'zod';
import type { ActionState } from '../interfaces';

export const createInitialState = <T>(): ActionState<T> => {
  return {
    errors: {},
    message: '',
  };
};

export const handleZodErros = <T>(error: unknown, rawData: Partial<T>) => {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors;
    return {
      errors: fieldErrors,
      message: 'Por favor corrige los errores en el formulario',
      formData: rawData,
    };
  }
  return {
    errors: {},
    message: 'Paso un problema',
    formData: rawData,
  };
};
