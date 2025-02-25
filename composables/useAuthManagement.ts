import type { GrantId } from '~/types/Grant'

const AUTH_MANAGEMENT_BASE_URL = '/auth-management'

export function useAuthManagement() {
  const dialogState = ref({
    isDialogOpen: false,
    isMaxAttemptsDialogOpen: false,
    isIncorrectCredentialsOpen: false,
    isSuspendedDialogOpen: false,
    isCommonErrorDialogOpen: false,
  })

  const getMyGrants = async () => {
    const { status, error, data, refresh } = await useAPI<GrantId[]>(
      `${AUTH_MANAGEMENT_BASE_URL}/get-my-grants`,
      {
        method: 'GET',
      } as any,
      true,
    )
    const emptyGrants = ref([])
    return { status, error, data: data.value ? data : emptyGrants, refresh }
  }

  const login = async (values: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, password: values.password }),
    })

    return response
  }

  const loginByOtp = async (values: any) => {
    const response = await fetch('/api/auth/login-by-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    return response
  }

  const authSignIn = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${AUTH_MANAGEMENT_BASE_URL}/register-participant`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  const registerParticipantByOtp = async (values: any) => {
    const { status, error, data }: any = await useAPI(
      `${AUTH_MANAGEMENT_BASE_URL}/register-participant-by-otp`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error, data }
  }

  const validateOtp = async (values: any) => {
    const { status, error, data }: any = await useAPI(
      `${AUTH_MANAGEMENT_BASE_URL}/validate-otp`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error, data }
  }

  const resendOtp = async (values: any) => {
    const { status, error, data }: any = await useAPI(
      `${AUTH_MANAGEMENT_BASE_URL}/resend-otp`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error, data }
  }

  const handleApiError = (errorBack: any) => {
    console.log(`Probando ${JSON.stringify(errorBack)}`)
    // errors.value.api = errorBack.message
    dialogState.value.isIncorrectCredentialsOpen = true
    // switch (errorBack.code) {
    //   case AUTH_ERRORS.INVALID_CREDENTIALS:
    //     dialogState.value.isIncorrectCredentialsOpen = true
    //     break
    //   case AUTH_ERRORS.MAX_ATTEMPTS_LIMIT_EXCEED:
    //     dialogState.value.isMaxAttemptsDialogOpen = true
    //     break
    //   case AUTH_ERRORS.USER_IS_SUSPENDED:
    //     dialogState.value.isSuspendedDialogOpen = true
    //     break
    //   default:
    //     dialogState.value.isCommonErrorDialogOpen = true
    //     commonErrorDialogMessage.value = errorBack.message
    //     break
    // }
  }

  const closeDialog = (dialogName) => {
    dialogState.value[dialogName] = false
  }

  return {
    getMyGrants,
    authSignIn,
    dialogState,
    handleApiError,
    closeDialog,
    resendOtp,
    validateOtp,
    loginByOtp,
    login,
    registerParticipantByOtp,
  }
}
