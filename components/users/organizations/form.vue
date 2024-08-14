<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { Organization } from "~/models/organizations";

import { X } from "lucide-vue-next";
import { parseDate } from "@internationalized/date";
const BASE_ORG_URL = "/organization-management";
let form: any;
const props = defineProps<{
  rucNumber: number | undefined;
  onSubmit: (values: any) => void;
}>();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "La razón social es requerida"),
    rucNumber: z
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
    representativeFullName: z
      .string()
      .min(1, "El nombre y apellidos del representante es requerido"),
    representativeDocumentType: z.enum(["DNI", "CE", "PT"]),
    representativeDocumentIdentifier: z
      .string()
      .regex(/^\d+$/, "El documento debe contener solo dígitos.")
      .min(1, "El DNI del representante es requerido"),
    representativePhoneNumber: z
      .string()
      .regex(/^\d+$/, "El número de teléfono debe contener solo dígitos.")
      .optional()
      .nullable(),
    attachedFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo")
      .max(3, "Puede subir un máximo de 3 archivos"),
  }),
);
interface OrganizationForm extends Organization {
  department?: string;
  province?: string;
  districtId?: string;
  addressLine1?: string;
  economicActivityId?: string;
}
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

if (props.rucNumber) {
  const { data: organizationData } = await useAPI<Organization>(
    `${BASE_ORG_URL}/get-organization-detail`,
    {
      method: "GET",
      query: {
        rucNumber: props.rucNumber,
      },
    } as any,
  );
  const orgData: OrganizationForm = { ...organizationData.value };
  orgData.department = orgData.address?.district?.id.split("+")[0] || "";
  orgData.province =
    `${orgData.department}+${orgData.address?.district?.id.split("+")[1]}` ||
    "";
  orgData.districtId = orgData.address.district.id;
  orgData.economicActivityId = orgData.economicActivity?.id;
  orgData.addressLine1 = orgData.address.addressLine1;
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
  form = useForm({ validationSchema: formSchema });
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
      props.rucNumber
        ? "Actualizar datos de organización"
        : "Registrar organización"
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
                    <SelectItem
                      v-for="activity in economicActivities"
                      :key="activity.id"
                      :value="activity.id"
                    >
                      {{ activity.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2 class="text-primary text-base font-normal leading-5">
          Representante Legal
        </h2>
        <!-- Nombre Completo -->
        <FormField v-slot="{ componentField }" name="representativeFullName">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Nombre Completo"
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
            name="representativeDocumentType"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="px-2">
                    <SelectValue placeholder="Tipo de Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PT">PT</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Número de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="representativeDocumentIdentifier"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Número de Documento"
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
              <Input
                type="text"
                placeholder="Número de contacto"
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
                placeholder="Correo de facturación"
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
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Porcentaje de Inicio"
                v-bind="componentField"
              />
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
              <Select
                v-bind="componentField"
                @update:modelValue="
                  (value) => {
                    form.values.department = value;
                    handleStateChange(value);
                  }
                "
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="state in states"
                      :key="state.id"
                      :value="state.id"
                    >
                      {{ state.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
          <!-- Provincia -->
          <FormField v-slot="{ componentField }" name="province">
            <FormItem class="w-1/2">
              <FormControl>
                <Select
                  v-bind="componentField"
                  @update:modelValue="
                    (value) => {
                      form.values.province = value;
                      handleCityChange(value);
                    }
                  "
                  :disabled="!form.values.department"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="city in cities"
                        :key="city.id"
                        :value="city.id"
                      >
                        {{ city.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Distrito -->
          <FormField v-slot="{ componentField }" name="districtId">
            <FormItem class="w-1/2">
              <FormControl>
                <Select
                  v-bind="componentField"
                  :disabled="!form.values.province"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="district in districts"
                        :key="district.id"
                        :value="district.id"
                      >
                        {{ district.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

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
          {{ props.rucNumber ? "Actualizar datos" : "Registrar" }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
