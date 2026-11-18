/** Estado devuelto por las Server Actions de formularios (useActionState). */
export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Valores a reponer en el formulario tras un error (nunca contraseñas). */
  values?: Record<string, string>;
};

export const initialFormState: FormState = {};
