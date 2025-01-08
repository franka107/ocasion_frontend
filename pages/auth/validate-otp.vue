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
      <form @submit="mvi.onSubmit">
        <Card class="w-full">
          <CardHeader>
            <CardTitle>Validación de cuenta</CardTitle>
            <CardDescription
              >Hemos enviado un código de 5 dígitos a tu correo electrónico,
              revisa tu bandeja de entrada.</CardDescription
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
                      @complete="mvi.onOptInputComplete"
                      @update:model-value="
                        (arrStr) => {
                          mvi.form.setFieldValue('otp', arrStr.filter(Boolean))
                        }
                      "
                    >
                      <PinInputGroup>
                        <PinInputInput
                          v-for="(id, index) in 5"
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
          <CardFooter class="flex justify-end px-6 pb-6">
            <Button>Enviar</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const mvi = useValidateOtpMvi()
</script>

<style scoped></style>
