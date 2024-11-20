<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useForm } from 'vee-validate';
import InputFile from '@/components/common/file/Input.vue';

const props = defineProps<{
  onSubmit: (values: any) => void;
}>();

const emit = defineEmits(['update:modelValue']);

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .min(1, 'El nombre del evento es requerido.')
      .max(200, 'El nombre del evento no puede superar los 200 caracteres'),
    lastName: z.string().min(1, 'El apellido paterno es requerido'),
    documentType: z.enum(['DNI', 'CE', 'PT']),
    documentIdentifier: z
      .string()
      .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
      .min(1, 'El documento del representante es requerido'),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, 'El número de teléfono debe contener solo dígitos.')
      .min(9, 'El número de teléfono debe tener al menos 9 dígitos'),   
    email: z.string().email('El correo electrónico no es válido').optional().nullable(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED']).optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    birthDate: z.string().nonempty('La fecha de nacimiento es requerida').optional(),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
      required_error: 'El estado es requerido.',
    }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values);
  emit('update:modelValue', false);
});

</script>

<template>
    <SheetHeader class="justify-between">
        <SheetTitle class="ml-2 text-[20px] font-[700] text-[#152A3C]">
            Detalle participante
        </SheetTitle>
        <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
            <X class="w-4 h-4 text-muted-foreground" />
        </SheetClose>
    </SheetHeader>

    <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
        <form class="flex flex-col gap-6 flex-grow pb-[32px] pt-[40px] px-6 gap-y-[24px]" @submit="onSubmit">
            <section class="flex-grow">
                <div class="grid grid-cols-1 gap-4 mb-[24px]">
                    <!-- Nombre  -->
                    <FormField v-slot="{ componentField }" name="firstName">
                        <FormItem>
                        <FormControl>
                            <CustomInput type="text" label="Nombres" v-bind="componentField" disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- Apellidos  -->
                    <FormField v-slot="{ componentField }" name="lastName">
                        <FormItem>
                        <FormControl>
                            <CustomInput type="text" label="Apellidos" v-bind="componentField" disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    </FormField>
                    <div class="flex gap-2">
                        <!-- Tipo de Documento -->
                        <FormField v-slot="{ componentField }" name="documentType">
                            <FormItem class="w-1/2">
                                <FormControl>
                                <CustomSelect v-bind="componentField" label="Tipo de Movimiento" :items="[
                                    { id: 'DNI', name: 'DNI' },
                                    { id: 'CE', name: 'CE' },
                                    { id: 'PT', name: 'PT' },
                                ]" placeholder="Tipo de Documento" disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            </FormField>
                            <!-- Número de Documento -->
                            <FormField v-slot="{ componentField }" name="documentIdentifier">
                            <FormItem class="w-1/2">
                                <FormControl>
                                <CustomInput type="text" label="N° documento" v-bind="componentField" disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField v-slot="{ componentField }" name="phoneNumber">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="tel" label="Número de Teléfono" v-bind="componentField" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem>
                        <FormControl>
                            <CustomInput type="email" label="Correo" v-bind="componentField" disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    </FormField>
                    <div class="flex gap-2">
                        <!-- Sexo -->
                        <FormField v-slot="{ componentField }" name="gender">
                        <FormItem class="w-1/2">
                            <FormControl>
                            <CustomSelect :items="[
                                { id: 'MALE', name: 'Masculino' },
                                { id: 'FEMALE', name: 'Femenino' },
                            ]" placeholder="Sexo" v-bind="componentField" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        </FormField>
                        <!-- Estado Civil -->
                        <FormField v-slot="{ componentField }" name="maritalStatus">
                        <FormItem class="w-1/2">
                            <FormControl>
                            <CustomSelect :items="[
                                { id: 'SINGLE', name: 'Soltero' },
                                { id: 'MARRIED', name: 'Casado' },
                                { id: 'WIDOWED', name: 'Viudo' },
                                { id: 'DIVORCED', name: 'Divorciado' },
                            ]" placeholder="Estado Civil" v-bind="componentField" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        </FormField>
                    </div>
                    <!-- Fecha de Nacimiento -->
                    <FormField v-slot="{ componentField }" name="birthDate">
                        <FormItem>
                            <FormControl>
                            <CustomInput type="date" label="Fecha de Nacimiento" v-bind="componentField" disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- Status -->
                    <FormField v-slot="{ componentField }" name="status">
                        <FormItem>
                            <FormControl>
                            <CustomSelect
                                v-bind="componentField"
                                :items="[
                                { id: 'ACTIVE', name: 'Activo' },
                                { id: 'INACTIVE', name: 'Inactivo' },
                                ]"
                                placeholder="Estado"
                                disabled
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
            </section>
        </form>
    </div>
</template>
