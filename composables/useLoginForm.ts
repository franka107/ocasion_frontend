import { ref } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { UserType } from "~/types/Administrators";
import type { Organization } from "~/models/organizations";

export function useLoginForm() {
  const email = ref("");
  const password = ref("");
  const showPassword = ref(false);
  const showForgotPassword = ref(false);
  const isLoading = ref(false);

  const dialogState = ref({
    isDialogOpen: false,
    isMaxAttemptsDialogOpen: false,
    isIncorrectCredentialsOpen: false,
    isSuspendedDialogOpen: false,
  });

  const errors = ref({
    email: "",
    password: "",
    api: "",
  });

  const router = useRouter();

  const schema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
  });

  const AUTH_ERRORS = {
    INVALID_CREDENTIALS: "AUTH.INVALID_CREDENTIALS",
    MAX_ATTEMPTS_LIMIT_EXCEED: "AUTH.MAX_ATTEMPTS_LIMIT_EXCEED",
    USER_IS_SUSPENDED: "AUTH.USER_IS_SUSPENDED",
  };

  const validate = () => {
    errors.value = { email: "", password: "", api: "" };
    try {
      schema.parse({ email: email.value, password: password.value });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err: any) => {
          errors.value[err.path[0]] = err.message;
        });
      }
      return false;
    }
  };

  const { fetch: fetchUserSession } = useUserSession();

  const handleSubmit = async () => {
    if (!validate()) return;

    isLoading.value = true;
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        handleApiError(errorBody.data.errors[0]);
        return;
      }

      await fetchUserSession();

      const successBody = await response.json();

      handleLoginRouting(successBody.user);
    } catch (error) {
      errors.value.api =
        "Hubo un error durante el inicio de sesión. Por favor, intente de nuevo.";
    } finally {
      isLoading.value = false;
    }
  };

  const handleLoginRouting = (user: any) => {
    const userType: UserType = user.type;
    console.log("userType", userType);
    switch (userType) {
      case UserType.SuperAdmin:
      case UserType.PlatformUser:
      case UserType.PlatformAdmin:
        router.push("/dashboard/platform/events");
        break;
      case UserType.OrganizationUser:
      case UserType.OrganizationAdmin:
        if (user.organizations.length === 0) {
          throw new Error(
            "No hay organizaciones asociadas al usuario de tipo organizacion",
          );
        }
        const organization: Organization = user.organizations[0];
        router.push(`/dashboard/organization/${organization.id}/events`);
        break;
      case UserType.Participant:
        router.push("/app");
        break;
    }
  };

  const handleApiError = (errorBack: any) => {
    errors.value.api = errorBack.message;

    switch (errorBack.code) {
      case AUTH_ERRORS.INVALID_CREDENTIALS:
        dialogState.value.isIncorrectCredentialsOpen = true;
        break;
      case AUTH_ERRORS.MAX_ATTEMPTS_LIMIT_EXCEED:
        dialogState.value.isMaxAttemptsDialogOpen = true;
        break;
      case AUTH_ERRORS.USER_IS_SUSPENDED:
        dialogState.value.isSuspendedDialogOpen = true;
        break;
      default:
        errors.value.api = "Error desconocido. Intente de nuevo.";
        break;
    }
  };

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleForgotPassword = () => {
    showForgotPassword.value = !showForgotPassword.value;
  };

  const closeDialog = (dialogName) => {
    dialogState.value[dialogName] = false;
  };

  const goToUpdatePassword = () => {
    router.push("/auth/updatePassword");
  };

  return {
    email,
    password,
    showPassword,
    showForgotPassword,
    isLoading,
    dialogState,
    errors,
    validate,
    handleSubmit,
    togglePassword,
    toggleForgotPassword,
    closeDialog,
    goToUpdatePassword,
  };
}
