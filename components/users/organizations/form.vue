<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { IOrganization } from "~/models/organizations";

const props = defineProps<{
  // organization?: {
  //   name: string;
  //   rucNumber: string;
  //   billingEmail?: string;
  //   economicActivity?: string;
  //   address: string;
  //   department: string;
  //   province: string;
  //   district: string;
  //   contractStartDate: string;
  //   contractEndDate: string;
  //   representativeFullName: string;
  //   representativeDocumentIdentifier: string;
  //   representativePhoneNumber?: string;
  //   attachedFiles?: string[];
  // };
  organization?: IOrganization | null;
  onsubmit: (values: any) => void;
}>();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "La razón social es requerida"),
    rucNumber: z.string().min(1, "El número de RUC es requerido"),
    billingEmail: z.string().email("El correo de facturación no es válido"),
    economicActivityId: z.string().optional(),
    addressLine1: z.string().min(1, "La dirección es requerida"),
    districtId: z.string().min(1, "El distrito es requerido"),
    contractStartDate: z
      .string()
      .min(1, "La fecha de inicio del contrato es requerida"),
    contractEndDate: z
      .string()
      .min(1, "La fecha de fin del contrato es requerida"),
    representativeFullName: z
      .string()
      .min(1, "El nombre y apellidos del representante es requerido"),
    representativeDocumentIdentifier: z
      .string()
      .min(1, "El DNI del representante es requerido"),
    representativePhoneNumber: z
      .string()
      .min(1, "El teléfono del representante es requerido"),
    attachedFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo")
      .max(3, "Puede subir un máximo de 3 archivos"),
  })
);

const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: props.organization
    ? {
        name: props.organization.name,
        rucNumber: props.organization.rucNumber,
        billingEmail: props.organization.billingEmail,
        economicActivityId: props.organization.economicActivity.id,
        addressLine1: props.organization.address.addressLine1,
        districtId: props.organization.address.district.id,
        contractStartDate: props.organization.contractStartDate,
        contractEndDate: props.organization.contractEndDate,
        representativeFullName: props.organization.representativeFullName,
        representativeDocumentIdentifier:
          props.organization.representativeDocumentIdentifier,
        representativePhoneNumber: props.organization.representativePhoneNumber,
        attachedFiles: props.organization.attachedFiles,
      }
    : {},
});

watch(
  () => props.organization,
  (newOrganization) => {
    resetForm({
      values: newOrganization
        ? {
            name: newOrganization.name,
            rucNumber: newOrganization.rucNumber,
            billingEmail: newOrganization.billingEmail,
            economicActivityId: newOrganization.economicActivity.id,
            addressLine1: newOrganization.address.addressLine1,
            districtId: newOrganization.address.district.id,
            contractStartDate: newOrganization.contractStartDate,
            contractEndDate: newOrganization.contractEndDate,
            representativeFullName: newOrganization.representativeFullName,
            representativeDocumentIdentifier:
              newOrganization.representativeDocumentIdentifier,
            representativePhoneNumber:
              newOrganization.representativePhoneNumber,
            attachedFiles: newOrganization.attachedFiles,
          }
        : {},
    });
  }
);

// watch(values, (newValues) => {
//   console.log('Form values:', newValues);
//   console.log('Attached Files:', newValues.attachedFiles); // Revisa este log
// });

const onSubmit = handleSubmit((values) => {
  const { economicActivityId, addressLine1, districtId, ...restValues } =
    values;

  const formattedValues = {
    ...restValues,
    economicActivity: { id: economicActivityId },
    address: {
      addressLine1: addressLine1,
      district: { id: districtId },
    },
  };

  props.onsubmit(formattedValues);
});

// const handleFilesChange = (files: File[]) => {
//   values.attachedFiles = files.map((file) => file.name);
// };
const handleFilesChange = (files: File[]) => {
  values.attachedFiles = files.map((file) => file.name);
};
</script>

<template>
  <SheetContent class="flex flex-col h-full">
    <SheetHeader>
      <SheetTitle>{{
        props.organization ? "Editar empresa" : "Registrar empresa"
      }}</SheetTitle>
    </SheetHeader>

    <div class="border-primary border-t-[1px]"></div>

    <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
      <form class="flex flex-col gap-4 flex-grow p-1" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="attachedFiles">
          <FormItem>
            <FormControl>
              <InputFile
                v-model="values.attachedFiles"
                @update:value="handleFilesChange"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2>Datos Básicos</h2>
        <!-- Razón Social -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Razón Social"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Número de RUC -->
        <FormField v-slot="{ componentField }" name="rucNumber">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Número de RUC"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Correo de Facturación -->
        <FormField v-slot="{ componentField }" name="billingEmail">
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Correo de Facturación"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Actividad Económica -->
        <FormField v-slot="{ componentField }" name="economicActivityId">
          <FormItem>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Actividad Económica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="agriculture">Agricultura</SelectItem>
                    <SelectItem value="commerce">Comercio</SelectItem>
                    <SelectItem value="technology">Tecnología</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2>Ubicación</h2>
        <!-- Dirección -->
        <FormField v-slot="{ componentField }" name="addressLine1">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Dirección"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Departamento -->
        <FormField v-slot="{ componentField }" name="department">
          <FormItem>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lima">Lima</SelectItem>
                    <SelectItem value="cusco">Cusco</SelectItem>
                    <SelectItem value="arequipa">Arequipa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Provincia -->
        <FormField v-slot="{ componentField }" name="province">
          <FormItem>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Provincia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lima">Lima</SelectItem>
                    <SelectItem value="cusco">Cusco</SelectItem>
                    <SelectItem value="arequipa">Arequipa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Distrito -->
        <FormField v-slot="{ componentField }" name="districtId">
          <FormItem>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="miraflores">Miraflores</SelectItem>
                    <SelectItem value="san_isidro">San Isidro</SelectItem>
                    <SelectItem value="surco">Surco</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2>Duración de Contrato</h2>
        <!-- Fecha de Inicio del Contrato -->
        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="contractStartDate">
            <FormItem class="w-1/2">
              <FormControl>
                <Input
                  type="date"
                  placeholder="Fecha de Inicio del Contrato"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Fecha de Fin del Contrato -->
          <FormField v-slot="{ componentField }" name="contractEndDate">
            <FormItem class="w-1/2">
              <FormControl>
                <Input
                  type="date"
                  placeholder="Fecha de Fin del Contrato"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <h2>Representante Legal</h2>
        <!-- Nombre y Apellidos del Representante -->
        <FormField v-slot="{ componentField }" name="representativeFullName">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Nombre y Apellidos del Representante"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
          <!-- DNI del Representante -->
          <FormField
            v-slot="{ componentField }"
            name="representativeDocumentIdentifier"
          >
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="DNI del Representante"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Teléfono del Representante -->
          <FormField
            v-slot="{ componentField }"
            name="representativePhoneNumber"
          >
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Teléfono del Representante"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Botón de Submit -->
        <SheetFooter class="mt-auto">
          <Button
            :disabled="!meta.valid"
            type="submit"
            :class="
              cn(
                'w-full',
                !meta.valid
                  ? 'text-primary bg-bgtheme'
                  : 'hover:text-primary hover:bg-bgtheme'
              )
            "
          >
            Registrar
          </Button>
        </SheetFooter>
      </form>
    </div>
  </SheetContent>
</template>
