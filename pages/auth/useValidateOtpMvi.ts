import { toTypedSchema } from '@vee-validate/zod'
import { isRestTypeNode } from 'typescript'
import { useForm } from 'vee-validate'
import { z } from 'zod'

export const otpFormSchema = z.object({
  otp: z.array(z.coerce.string()).length(6, { message: 'Deben ser 6 dígitos' }),
})

export const useValidateOtpMvi = () => {
  const authManagement = useAuthManagement()
  const router = useRouter()
  const route = useRoute()
  const alertDialog = ref<null | {
    message: string
    variant: 'default' | 'destructive'
  }>(null)
  const isResendOtpInProgress = ref(false)
  const isResendOtpBlocked = ref(false)
  const isValidateOtpInProgress = ref(false)
  const userSession = useUserSession()
  const form = useForm({
    validationSchema: toTypedSchema(otpFormSchema),
    initialValues: {
      otp: [],
    },
  })
  const secondsToResendOtp = ref(0)

  const blockOtpButtonFor30Seconds = () => {
    isResendOtpBlocked.value = true
    secondsToResendOtp.value = 30
    const interval = setInterval(() => {
      secondsToResendOtp.value--
      if (secondsToResendOtp.value === 0) {
        clearInterval(interval)
        isResendOtpBlocked.value = false
      }
    }, 1000)
  }

  const validateOtp = async () => {
    isValidateOtpInProgress.value = true
    const { status, error, data } = await authManagement.validateOtp({
      otp: form.values.otp?.join(''),
      userId: route.query.id,
    })
    if (status.value === 'success') {
      alertDialog.value = {
        message: 'Código validado correctamente',
        variant: 'default',
      }
      await authManagement.loginByOtp(data.value)
      await userSession.fetch()
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push('/dashboard/participant/my-bids')
    } else {
      alertDialog.value = {
        message: error.value.data.errors[0].message,
        variant: 'destructive',
      }
    }
    isValidateOtpInProgress.value = false
  }

  const intentOtpInputComplete = async (e: string[]) => {
    await validateOtp()
  }

  const intentResendOtp = async () => {
    isResendOtpInProgress.value = true
    const { status, error } = await authManagement.resendOtp({
      userId: route.query.id,
    })
    if (status.value === 'success') {
      alertDialog.value = {
        message: 'Código reenviado correctamente',
        variant: 'default',
      }
      blockOtpButtonFor30Seconds()
    } else {
      alertDialog.value = {
        message: error.value.data.errors[0].message,
        variant: 'destructive',
      }
    }
    isResendOtpInProgress.value = false
  }

  const intentSubmit = async (e: Event) => {
    e.preventDefault()
    await validateOtp()
  }

  return {
    form,
    alertDialog: readonly(alertDialog),
    isResendOtpInProgress: readonly(isResendOtpInProgress),
    isValidateOtpInProgress: readonly(isValidateOtpInProgress),
    isResendOtpBlocked: readonly(isResendOtpBlocked),
    secondsToResendOtp: readonly(secondsToResendOtp),
    intentSubmit,
    intentOtpInputComplete,
    intentResendOtp,
  }
}
