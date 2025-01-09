<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <div
      class="flex flex-col items-center sm:items-start w-full max-w-[572px] mx-auto"
    >
      <!-- Logo con su subtítulo si está presente -->
      <div class="mb-6 ml-4">
        <img
          src="/assets/img/logo.png"
          alt="Deocasión logo"
          class="w-[205.52px] h-[48px] mb-2"
        />
        <span class="text-sm text-cyan-500">Autenticación</span>
      </div>
      <form @submit="mvi.intentSubmit">
        <Card class="w-full">
          <CardHeader>
            <CardTitle>Validación de cuenta</CardTitle>
            <CardDescription
              >Hemos enviado un código de 5 dígitos a tu correo electrónico,
              revisa tu bandeja de entrada.
              <Button
                :disabled="
                  mvi.isResendOtpInProgress.value ||
                  mvi.isResendOtpBlocked.value
                "
                variant="link"
                class="mx-0 px-0"
                @click="mvi.intentResendOtp"
              >
                <Loader2
                  v-if="mvi.isResendOtpInProgress.value"
                  class="w-4 h-4 mr-2 animate-spin"
                />
                <span v-if="!mvi.isResendOtpInProgress.value">
                  {{
                    mvi.isResendOtpBlocked.value
                      ? `Puedes reenviar el código en ${mvi.secondsToResendOtp.value} segundos`
                      : 'Reenviar código'
                  }}
                </span></Button
              ></CardDescription
            >
          </CardHeader>
          <CardContent>
            <div class="space-y-6 mx-auto flex justify-center">
              <FormField v-slot="{ componentField, value }" name="otp">
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <PinInput
                      id="otp-input"
                      :model-value="value"
                      placeholder="○"
                      class="flex gap-2 items-center mt-1"
                      otp
                      type="number"
                      :name="componentField.name"
                      @complete="mvi.intentOtpInputComplete"
                      @update:model-value="
                        (arrStr) => {
                          mvi.form.setFieldValue('otp', arrStr.filter(Boolean))
                        }
                      "
                    >
                      <PinInputGroup>
                        <PinInputInput
                          v-for="(id, index) in 6"
                          :key="id"
                          :index="index"
                        />
                      </PinInputGroup>
                    </PinInput>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
          <CardFooter class="flex-col justify-end px-6 pb-6">
            <Button :disabled="mvi.isValidateOtpInProgress.value">
              <Loader2
                v-if="mvi.isValidateOtpInProgress.value"
                class="w-4 h-4 mr-2 animate-spin"
              />
              Enviar</Button
            >
            <Alert
              v-if="mvi.alertDialog.value != null"
              :variant="mvi.alertDialog.value?.variant"
              class="mt-5"
            >
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>{{
                mvi.alertDialog.value.variant === 'destructive'
                  ? 'Operación fallida'
                  : 'Operación exitosa'
              }}</AlertTitle>
              <AlertDescription>
                {{ mvi.alertDialog.value.message }}
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
  <Dialog>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">Cerrar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import { useValidateOtpMvi } from './useValidateOtpMvi'
import Card from '~/design-system/ui/card/Card.vue'
import CardHeader from '~/design-system/ui/card/CardHeader.vue'
import CardTitle from '~/design-system/ui/card/CardTitle.vue'
import CardDescription from '~/design-system/ui/card/CardDescription.vue'
import CardContent from '~/design-system/ui/card/CardContent.vue'
import CardFooter from '~/design-system/ui/card/CardFooter.vue'
import PinInput from '~/design-system/ui/pin-input/PinInput.vue'
import PinInputGroup from '~/design-system/ui/pin-input/PinInputGroup.vue'
import PinInputInput from '~/design-system/ui/pin-input/PinInputInput.vue'
import Dialog from '~/design-system/ui/dialog/Dialog.vue'
import DialogTrigger from '~/design-system/ui/dialog/DialogTrigger.vue'
import Button from '~/design-system/ui/button/Button.vue'
import DialogContent from '~/design-system/ui/dialog/DialogContent.vue'
import DialogHeader from '~/design-system/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/design-system/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/design-system/ui/dialog/DialogDescription.vue'
import Alert from '~/design-system/ui/alert/Alert.vue'
import AlertTitle from '~/design-system/ui/alert/AlertTitle.vue'
import AlertDescription from '~/design-system/ui/alert/AlertDescription.vue'

const mvi = useValidateOtpMvi()
</script>

<style scoped></style>
