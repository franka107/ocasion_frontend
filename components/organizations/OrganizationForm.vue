<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { Organization } from "~/models/organizations";

import { X } from "lucide-vue-next";
import { parseDate } from "@internationalized/date";
import CustomComboboxInput from "~/components/ui/custom-combobox-input/CustomComboboxInput.vue";
const BASE_ORG_URL = "/organization-management";
let form: any;
const props = defineProps<{
  id: number | undefined;
  onSubmit: (values: any) => void;
}>();

const organizationFormSchema = z.object({
  name: z.string().min(1, "La razón social es requerida"),
  id: z
    .string()
    .regex(/^\d+$/, "Este campo debe contener solo dígitos.")
    .length(11, "El número de RUC debe de ser 11 dígitos"),
  billingEmail: z
    .string()
    .email("Debe ser un correo electrónico")
    .optional()
    .nullable(),
  economicActivityId: z.string().optional().nullable(),
  addressLine1: z.string().min(1, "La dirección es requerida"),
  department: z.string().min(1, "El departamento es requerido"),
  province: z.string().min(1, "La provincia es requerida"),
  districtId: z.string().min(1, "El distrito es requerido"),
  contractStartDate: z
    .string()
    .min(1, "La fecha de inicio del contrato es requerida"),
  contractEndDate: z
    .string()
    .min(0, "La fecha de fin del contrato es requerida"),
  startPercentage: z
    .number()
    .min(0, "El porcentaje de inicio es requerido")
    .max(100, "El porcentaje no puede exceder el 100%"),
  representative: z
    .object({
      documentType: z.enum(["DNI", "CE", "PT"]),
      documentIdentifier: z
        .string()
        .regex(/^\d+$/, "El documento debe contener solo dígitos.")
        .min(1, `El documento del representante es requerido`),
    })
    .partial()
    .superRefine((schema, ctx) => {
      if (
        schema.documentType === "DNI" &&
        schema.documentIdentifier?.length !== 8
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El dni debe contener 8 digitos",
          path: ["documentIdentifier"],
        });
      }
      if (
        schema.documentType !== "DNI" &&
        schema.documentIdentifier?.length !== 9
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El ${schema.documentType} debe contener 9 digitos`,
          path: ["documentIdentifier"],
        });
      }
      return true;
    }),
  representativeFullName: z
    .string()
    .min(1, "El nombre y apellidos del representante es requerido")
    .max(200, "No puede superar los 200 caracteres"),
  representativePhoneNumber: z
    .string()
    .max(10, "No puede superar los 10 digitos")
    .regex(/^\d+$/, "El número de teléfono debe contener solo dígitos.")
    .optional()
    .nullable(),
  attachedFiles: z
    .array(z.any())
    .min(1, "Debe subir al menos un archivo")
    .max(3, "Puede subir un máximo de 3 archivos"),
});

type OrganizationForm = z.infer<typeof organizationFormSchema>;

const formSchema = toTypedSchema(organizationFormSchema);
// interface OrganizationForm extends Organization {
//   department?: string;
//   province?: string;
//   districtId?: string;
//   addressLine1?: string;
//   economicActivityId?: string;
// }
const { fetchCities, fetchDistricts, fetchStates, states, cities, districts } =
  useAddress();

const economicActivities = ref<Array<{ id: string; name: string }>>([]);

const fetchEconomicActivities = async () => {
  try {
    const { data } = await useAPI("/economic-activities", {
      default: () => [],
    });
    economicActivities.value = data.value;
  } catch (error) {
    console.error("Error al cargar actividades económicas:", error);
  }
};

if (props.id) {
  const { data: organizationData } = await useAPI<Organization>(
    `${BASE_ORG_URL}/get-organization-detail`,
    {
      method: "GET",
      query: {
        id: props.id,
      },
    } as any,
  );
  const orgData: any = { ...organizationData.value, representative: {} };

  orgData.department = orgData.address.district.city.state.id;
  orgData.province = orgData.address.district.city.id;
  orgData.districtId = orgData.address.district.id;
  orgData.economicActivityId = orgData.economicActivity?.id;
  orgData.addressLine1 = orgData.address.addressLine1;
  orgData.representative.documentType = orgData.representativeDocumentType;
  orgData.representative.documentIdentifier =
    orgData.representativeDocumentIdentifier;
  await Promise.all([
    fetchCities(orgData.department),
    fetchDistricts(orgData.province),
    fetchEconomicActivities(),
    fetchStates(),
  ]);
  console.log("orgData", orgData);

  form = useForm({
    validationSchema: formSchema,
    initialValues: orgData,
  });
} else {
  await Promise.all([fetchEconomicActivities(), fetchStates()]);
  form = useForm({
    validationSchema: formSchema,
    initialValues: { startPercentage: 0 },
  });
}

const handleStateChange = (stateId: string) => {
  console.log("stateId", stateId);
  cities.value = []; // Limpiar las provincias
  districts.value = []; // Limpiar los distritos
  fetchCities(stateId);
};

const handleCityChange = (cityId: string) => {
  districts.value = []; // Limpiar los distritos
  fetchDistricts(cityId);
};

watch(form.values, (newValues) => {
  console.log("Form values:", newValues);
  console.log("Attached Files:", newValues.attachedFiles); // Revisa este log
});

const onSubmit = form.handleSubmit((values: OrganizationForm) => {
  const { economicActivityId, addressLine1, districtId, ...restValues } =
    values;

  const formattedValues = {
    ...restValues,
    economicActivity: economicActivityId ? { id: economicActivityId } : null,
    representativeDocumentType: restValues.representative.documentType,
    representativeDocumentIdentifier:
      restValues.representative.documentIdentifier,
    address: {
      addressLine1: addressLine1,
      district: { id: districtId },
    },
  };
  props.onSubmit(formattedValues);
});

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name);
};
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id ? "Actualizar datos de organización" : "Registrar organización"
    }}</SheetTitle>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5">
        <FormField v-slot="{ componentField }" name="attachedFiles">
          <FormItem>
            <FormControl>
              <InputFile
                v-model="form.values.attachedFiles"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2 class="text-primary text-base font-normal leading-5">
          Datos Básicos
        </h2>

        <!-- Número de RUC -->
        <FormField v-slot="{ componentField }" name="id">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Número de RUC"
                v-bind="componentField"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Razón Social -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Razón Social"
                v-bind="componentField"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Actividad Económica -->
        <FormField v-slot="{ componentField }" name="economicActivityId">
          <FormItem>
            <FormControl class="w-full">
              <CustomComboboxInput
                @update:modelValue="componentField.onChange"
                label="Actividad económica"
                class="w-full truncate"
                :options="
                  economicActivities.map((e) => ({
                    value: e.id,
                    label: e.name,
                  }))
                "
                :value="componentField.modelValue"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- <FormField v-slot="{ componentField }" name="economicActivityId"> -->
        <!--   <FormItem> -->
        <!--     <FormControl> -->
        <!--       <Select v-bind="componentField"> -->
        <!--         <SelectTrigger> -->
        <!--           <SelectValue placeholder="Actividad Económica" /> -->
        <!--         </SelectTrigger> -->
        <!--         <SelectContent> -->
        <!--           <SelectGroup> -->
        <!--             <SelectItem -->
        <!--               v-for="activity in economicActivities" -->
        <!--               :key="activity.id" -->
        <!--               :value="activity.id" -->
        <!--             > -->
        <!--               {{ activity.name }} -->
        <!--             </SelectItem> -->
        <!--           </SelectGroup> -->
        <!--         </SelectContent> -->
        <!--       </Select> -->
        <!--     </FormControl> -->
        <!--     <FormMessage /> -->
        <!--   </FormItem> -->
        <!-- </FormField> -->

        <h2 class="text-primary text-base font-normal leading-5">
          Representante Legal
        </h2>
        <!-- Nombre Completo -->
        <FormField v-slot="{ componentField }" name="representativeFullName">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Nombre Completo"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
          <!-- Tipo de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="representative.documentType"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="[
                    { id: 'DNI', name: 'DNI' },
                    { id: 'CE', name: 'CE' },
                    { id: 'PT', name: 'PT' },
                  ]"
                  placeholder="Tipo de Documento"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Número de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="representative.documentIdentifier"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <CustomInput
                  type="text"
                  label="Número de Documento"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Teléfono -->
        <FormField v-slot="{ componentField }" name="representativePhoneNumber">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Número de contacto"
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
              <CustomInput
                type="email"
                label="Correo de facturación"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2 class="text-primary text-base font-normal leading-5">
          Porcentaje de inicio de subasta
        </h2>
        <!-- Porcentaje de Inicio -->
        <FormField v-slot="{ componentField }" name="startPercentage">
          <FormItem>
            <FormControl>
              <CustomInput
                type="number"
                label="Porcentaje de Inicio"
                v-bind="componentField"
              >
                <template #iconRight>
                  <span class="mr-2"> % </span>
                </template>
              </CustomInput>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2 class="text-primary text-base font-normal leading-5">
          Duración de Contrato
        </h2>
        <!-- Fecha de Inicio del Contrato -->
        <div class="flex gap-2">
          <FormField v-slot="{ componentField }" name="contractStartDate">
            <FormItem class="w-1/2">
              <FormControl>
                <DateInput
                  class="my-2"
                  @update:modelValue="componentField.onChange"
                  label="Fecha de inicio"
                  :value="componentField.modelValue"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Fecha de Fin del Contrato -->
          <FormField v-slot="{ componentField }" name="contractEndDate">
            <FormItem class="w-1/2">
              <FormControl>
                <DateInput
                  class="my-2"
                  @update:modelValue="componentField.onChange"
                  label="Fecha de fin"
                  :minValue="
                    form.values.contractStartDate
                      ? parseDate(form.values.contractStartDate)
                      : undefined
                  "
                  :value="componentField.modelValue"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <h2 class="text-primary text-base font-normal leading-5">Ubicación</h2>
        <!-- Departamento -->
        <FormField v-slot="{ componentField }" name="department">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                @update:modelValue="
                  (value) => {
                    handleStateChange(value);
                    form.setFieldValue('province', undefined);
                    form.setFieldValue('districtId', undefined);
                  }
                "
                :items="states"
                placeholder="Departamento"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
          <!-- Provincia -->
          <FormField v-slot="{ componentField }" name="province">
            <FormItem class="w-1/2">
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  @update:modelValue="
                    (value) => {
                      form.setFieldValue('districtId', undefined);
                      handleCityChange(value);
                    }
                  "
                  :disabled="!form.values.department"
                  :items="cities"
                  placeholder="Provincia"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Distrito -->
          <FormField v-slot="{ componentField }" name="districtId">
            <FormItem class="w-1/2">
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :disabled="!form.values.province"
                  :items="districts"
                  placeholder="Distrito"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Dirección -->
        <FormField v-slot="{ componentField }" name="addressLine1">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Dirección"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </section>

      <!-- Botón de Submit -->
      <!-- <Button type="submit">Guardar</Button> -->
      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full h-10 text-base bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ props.id ? "Actualizar datos" : "Registrar" }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
