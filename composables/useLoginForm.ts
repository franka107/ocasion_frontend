import { ref } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";

export function useLoginForm() {
  const email = ref("");
  const password = ref("");
  const showPassword = ref(false);
  const showForgotPassword = ref(false);
  const isDialogOpen = ref(false);
  const router = useRouter();
  const errors = ref({
    email: "",
    password: "",
    api: "",
  });

  const schema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string(),
  });

  const validate = () => {
    errors.value = { email: "", password: "", api: "" };
    try {
      schema.parse({ email: email.value, password: password.value });
      console.log("Validación exitosa");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === "email") {
            errors.value.email = err.message;
          } else if (err.path[0] === "password") {
            errors.value.password = err.message;
          }
        });
      }
      console.log("Errores de validación:", errors.value);
      return false;
    }
  };

  const { fetch: fetchUserSession, loggedIn } = useUserSession();

  const handleSubmit = async () => {
    if (validate()) {
      try {
        console.log("Iniciando solicitud a la API...");
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        console.log(`Error: ${response.ok}`);
        if (!response.ok) {
          const errorBody = await response.json();
          const errorBack = errorBody.data.errors[0];
          console.log(`Capturando ${JSON.stringify(errorBack)}`);
          errors.value.api = errorBack.message;
          if (errorBack.code === "AUTH.INCORRECT_EMAIL") {
            errors.value.email = errorBack.message;
          }
          if (errorBack.code === "AUTH.INCORRECT_PASSWORD") {
            errors.value.password = errorBack.message;
          }
        }

        console.log('Solicitud exitosa, obteniendo sesión del usuario...')
        await fetchUserSession()
        console.log('Sesión del usuario actualizada, redirigiendo al backoffice...')
        router.push("/backoffice/users/organizations")
      } catch (error) {
        console.error("Error during login:", error);
        errors.value.api =
          "Hubo un error durante el inicio de sesión. Por favor, intente de nuevo.";
      }
    }
  };

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleForgotPassword = () => {
    showForgotPassword.value = !showForgotPassword.value;
  };

  const closeDialog = () => {
    isDialogOpen.value = false;
  };

  const goToUpdatePassword = () => {
    console.log("Redirigiendo a la vista de actualización de contraseña");
    router.push("/auth/updatePassword");
  };

  return {
    email,
    password,
    showPassword,
    showForgotPassword,
    isDialogOpen,
    errors,
    validate,
    handleSubmit,
    togglePassword,
    toggleForgotPassword,
    closeDialog,
    goToUpdatePassword,
  };
}
