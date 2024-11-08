<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import type { UserItem } from '@/types/Profile'
const props = defineProps<{
    userDetail: UserItem
    onEdit: (values: any) => void;
}>()
const getInitialValues = () => ({
    businessName: props.userDetail.businessName || '',
    ruc: props.userDetail.ruc || '',
    legalRepresentative: props.userDetail.legalRepresentative || '',
    documentIdentifier: props.userDetail.documentIdentifier || '',
    taxAddress: props.userDetail.taxAddress || '',
    documentType: props.userDetail.documentType as 'DNI' | 'CE' | 'PT' || '',
    phoneNumber: props.userDetail.phoneNumber || '',
    email: props.userDetail.email || '',
});
const isEditing = ref(false)
const formSchema = toTypedSchema(
    z.object({
        businessName: z.string().min(1, 'El nombre del negocio es requerido').optional(),
        ruc: z
            .string()
            .regex(/^\d{11}$/, 'El RUC debe contener 11 dígitos')
            .optional(),
        legalRepresentative: z.string().min(1, 'El representante legal es requerido').optional(),
        billingEmail: z
            .string()
            .email('Debe ser un correo electrónico')
            .optional()
            .nullable(),
        documentType: z.enum(['DNI', 'CE', 'PT']),
        documentIdentifier: z
            .string()
            .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
            .min(1, `El documento del representante es requerido`),
        taxAddress: z.string().min(1, 'El Domicilio Fiscal es requerida').optional(),
        phoneNumber: z.string().min(9, 'El número de teléfono debe tener al menos 9 dígitos'),
        email: z.string().email('Debe ser un correo electrónico válido'),
    })
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: getInitialValues()
})
if (props.userDetail) {
    form.setValues(getInitialValues());
}

const onSubmit = form.handleSubmit(async(values: any) => {
    const formattedValues = {
        ...values,
  }
    props.onEdit(formattedValues)
})
const startEditing = () => {
    isEditing.value = true
}
const cancelEdit = () => {
    isEditing.value = false;
    form.resetForm({ values: getInitialValues() });
};
</script>
<template>
    <div class="flex flex-row justify-between pt-[24px] pb-[26px] px-[24px] rounded-xl bg-white w-full">
        <div>
            <h1 class="text-[20px] font-[700] leading-[28px] text-primary mb-[16px] leading-[8px]">
                {{ userDetail.businessName }}</h1>
            <div class="flex item-center">
                <CustomIcons name="person-pin" class="w-6 h-6" />
                <p class="text-[14px] text-[#20445E] font-[700]">Usuario <span class="text-[#68686C] font-[500]">{{
                    userDetail.email }}</span></p>
            </div>
        </div>
        <div v-if="!isEditing" class="h 10 w 10">
            <Button variant="default" @click="startEditing">
                Editar
            </Button>
        </div>
    </div>
    <div class="w-full mt-4 ">
        <div class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px] pb-[32px] px-6 ">
            <h1 class=" text-[20px] font-[700] leading-[28px] text-primary border-b-[1px] pb-[31.5px] border-[#E2E8F0]">
                Datos del Perfil</h1>
            <form @submit="onSubmit">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]">
                    <!-- Razón Social -->
                    <FormField v-slot="{ componentField }" name="businessName">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="text" label="Razón Social" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- RUC -->
                    <FormField v-slot="{ componentField }" name="ruc">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="text" label="RUC" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- Representante Legal -->
                    <FormField v-slot="{ componentField }" name="legalRepresentative">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="text" label="Representante Legal" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <div class="flex gap-2">
                        <!-- Tipo de Documento -->
                        <FormField v-slot="{ componentField }" name="documentType">
                            <FormItem class="w-1/2">
                                <FormControl>
                                    <CustomSelect v-bind="componentField" :items="[
                                        { id: 'DNI', name: 'DNI' },
                                        { id: 'CE', name: 'CE' },
                                        { id: 'PT', name: 'PT' },
                                    ]" placeholder="Tipo de DOI" 
                                    :disabled="!isEditing"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <!-- Número de Documento -->
                        <FormField v-slot="{ componentField }" name="documentIdentifier">
                            <FormItem class="w-full">
                                <FormControl>
                                    <CustomInput type="text" label="Número de Documento" v-bind="componentField" :disabled="!isEditing"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                    </div>
                    <!-- Dirección Fiscal -->
                    <FormField v-slot="{ componentField }" name="taxAddress">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="text" label="Domicilio Fiscal" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="phoneNumber">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="tel" label="Número de Teléfono" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem>
                            <FormControl>
                                <CustomInput type="t" label="Email" v-bind="componentField" :disabled="!isEditing"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                
                <div v-if="isEditing"
                    class="mt-4 px-6 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[10px] w-full">
                    <Button @click.prevent="cancelEdit" type="button" size="xl"
                        class="text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent">Cancelar</Button>
                    <Button 
                     type="submit" 
                     :disabled="!form.meta.value.valid" 
                     :class="cn(
                        'text-[14px] md:text-[16px] font-[600] bg-[#062339] hover:bg-gray-700',
                        !form.meta.value.valid
                            ? 'text-white'
                            : 'hover:text-primary hover:bg-bgtheme',
                    )
                        " size="xl">Confirmar</Button>
                </div>
            </form>
        </div>
    </div>
</template>