import { ref, computed, watch } from 'vue'
import { z } from 'zod'

export default function usePasswordRecovery() {
  const email = ref('')
  const error = ref('')
  const isSuccessDialogOpen = ref(false)

  const schema = z.object({
    email: z.string().email('Correo electrónico inválido'),
  })

  const closeSuccessDialog = () => {
    isSuccessDialogOpen.value = false
  }

  // Computa si el botón "Continuar" está activo basado en si hay texto en el correo
  const isActive = computed(() => email.value.trim().length > 0)

  // Computa la clase del botón "Continuar"
  // Computa la clase del botón "Continuar" para que sea igual al botón 'Iniciar sesión'
  const buttonClass = computed(() => {
    return isActive.value
      ? 'w-full py-2 mt-4 mb-8 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary'
      : 'w-full py-2 mt-4 mb-8 bg-[#F1F5F9] text-gray-400 rounded cursor-not-allowed'
  })
  const submitButtonClass = computed(() => {
    return 'w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary'
  })

  // Valida el correo electrónico y actualiza el error en consecuencia
  const validateEmail = () => {
    if (email.value.length === 0) {
      error.value = ''
      return true
    }

    try {
      schema.parse({ email: email.value })
      error.value = ''
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        error.value = err.errors[0].message
      }
      return false
    }
  }
  // Maneja el envío del formulario
  const handleSubmit = async () => {
    if (!validateEmail()) return

    try {
      // Simulación de respuesta de la API
      const response = await fetch('/api/auth/restore-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
        }),
      })

      if (response.ok) {
        // El correo existe, procede con la recuperación de contraseña
        console.log('Correo válido, proceder con la recuperación de contraseña')
        isSuccessDialogOpen.value = true
        return true
      } else {
        // El correo no existe en la base de datos
        error.value = 'El correo ingresado no está registrado'
        return false
      }
    } catch (err) {
      console.error('Error al verificar el correo:', err)
      error.value = 'Ocurrió un error al verificar el correo'
      return false
    }
  }

  // Vigila cambios en el correo y valida continuamente
  watch(email, () => {
    validateEmail()
  })

  return {
    email,
    error,
    isActive,
    buttonClass,
    submitButtonClass,
    isSuccessDialogOpen,
    validateEmail,
    handleSubmit,
    closeSuccessDialog,
  }
}
