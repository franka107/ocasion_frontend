import { ref, computed } from 'vue';
import { z } from 'zod';

export function useValidationForm() {
  const password = ref('');
  
  // Esquema de validación usando zod
  const passwordSchema = z.string().min(8, 'Al menos 8 caracteres').refine(value => /[a-z]/.test(value), 'Letras minúsculas (a-z)')
    .refine(value => /[A-Z]/.test(value), 'Letras mayúsculas (A-Z)')
    .refine(value => /[0-9]/.test(value), 'Números (0-9)')
    .refine(value => /[@$!%*#?&]/.test(value), 'Caracteres especiales (@$!%*#?&)');

  // Computed para verificar la validación
  const validationResult = computed(() => {
    const result = passwordSchema.safeParse(password.value);
    return {
      valid: result.success,
      errors: result.success ? [] : result.error.errors.map(error => error.message)
    };
  });

  return {
    password,
    validationResult
  };
}
