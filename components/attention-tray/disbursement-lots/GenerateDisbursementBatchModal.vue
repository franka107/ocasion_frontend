<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'


const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: boolean }>()
const formSchema = toTypedSchema(
  z.object({
    rejection: z.string().min(1, 'Seleccione un motivo de rechazo.'),
    comment: z.string().min(1, "El comentario es requerido."),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values)
  emit('update:modelValue', false) // Cierra el modal al enviar.
})
</script>

<template>
  <AlertDialog
    :open="modelValue"
    class="z-[30]"
    @update:open="(event) => emit('update:modelValue', event)"
  >
    <AlertDialogContent class="z-[98] h-auto max-w-[416px] px-0">
      <form class="flex flex-col gap-6 flex-grow max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50" @submit="onSubmit">
        <!-- Título -->
        <AlertDialogHeader class="border-b border-primary">
          <AlertDialogTitle
            class="text-xl tracking-[-0.5px] text-primary text-start font-[600] px-6 pb-[18px]"
            >Generar lote de desembolso</AlertDialogTitle
          >
        </AlertDialogHeader>

        <div class="grid grid-cols-2 gap-2 xl:gap-4 px-6">
          <div class="flex gap-2">
          <!-- Forma de pago -->
            <FormField v-slot="{ componentField }" name="accountType">
                <FormItem>
                <FormControl>
                    <CustomSelect
                    v-bind="componentField"
                    :items="[ { id: 'Savings', name: 'Ahorros' }, { id: 'Checking', name: 'Corriente' } ]"
                    staticLabel
                    placeholder="Tipo de cuenta"
                    disabled
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            </FormField>  
          <!-- Banco -->
            <FormField v-slot="{ componentField }" name="bank">
                  <FormItem>
                  <FormControl>
                      <CustomSelect
                      v-bind="componentField"
                      :items="[ { id: 'Bank1', name: 'Banco 1' }, { id: 'Bank2', name: 'Banco 2' } ]"
                      staticLabel
                      placeholder="Banco"
                      disabled
                      />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
            </FormField>      
          </div>
          <!-- Moneda -->
          <FormField v-slot="{ componentField }" name="currency">
              <FormItem class="w-1/2">
              <FormControl>
                  <CustomSelect
                  v-bind="componentField"
                  :items="[ { id: 'USD', name: 'USD' } ]"
                  staticLabel
                  placeholder="Moneda"
                  disabled
                  />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
          <!-- Cuenta cargo -->
          <FormField v-slot="{ componentField }" name="cciAccount">
              <FormItem>
              <FormControl>
                  <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  staticLabel
                  label="Cuenta destino (CCI)"
                  disabled
                  />
              </FormControl>
              <FormMessage />
              </FormItem>
          </FormField>
        </div>
        <!-- Botones -->
        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent mt-[16px]"
            @click="emit('update:modelValue', false)"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="xl"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="!form.meta.value.valid"
          >
            Confirmar
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
