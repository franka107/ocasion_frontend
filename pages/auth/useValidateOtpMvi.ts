import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

// Its a MVI hook
export const useValidateOtpMvi = () => {
  const authManagement = useAuthManagement()
  const router = useRouter()

  const otp = ref('')

  const formSchema = toTypedSchema(
    z.object({
      otp: z.array(z.coerce.string()).length(5, { message: 'Invalid input' }),
    }),
  )

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      otp: [],
    },
  })

  const onOptInputChange = (value: string) => {
    otp.value = value
  }

  const onOptInputComplete = (e: string[]) => console.log(e.join(''))

  const onSubmit = async () => {
    const jwtToken = await authManagement.validateOtp({
      otp: form.values.otp?.join(''),
    })
    console.log(jwtToken)
  }

  return {
    otp: readonly(otp),
    form,
    onSubmit,
    onOptInputChange,
    onOptInputComplete,
  }
}
