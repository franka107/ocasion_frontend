<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { Organization } from "~/models/organizations";

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "La razón social es requerida"),
    rucNumber: z.string().min(1, "El número de RUC es requerido"),
    billingEmail: z.string().optional().nullable(),
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
    startPercentage: z.number().min(0, "El porcentaje de inicio es requerido"),
    representativeFullName: z
      .string()
      .min(1, "El nombre y apellidos del representante es requerido"),
    representativeDocumentType: z.enum(["DNI", "CE", "PT"]),
    representativeDocumentIdentifier: z
      .string()
      .min(1, "El DNI del representante es requerido"),
    representativePhoneNumber: z.string().optional().nullable(),
    attachedFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo")
      .max(3, "Puede subir un máximo de 3 archivos"),
  })
);

const props = defineProps<{
  organization?: Organization | null;
  // organization?: z.infer<typeof formSchema> | null;
  onsubmit: (values: any) => void;
}>();

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.organization || {},
});

// Estado para almacenar las actividades económicas
const economicActivities = ref<Array<{ id: string; name: string }>>([]);
// Estado para almacenar los departamentos
const states = ref<Array<{ id: string; name: string }>>([]);
// Estado para almacenar las provincias
const cities = ref<Array<{ id: string; name: string }>>([]);
// Estado para almacenar los distritos
const districts = ref<Array<{ id: string; name: string }>>([]);

// Función para obtener las actividades económicas desde el endpoint
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

// Función para obtener los departamentos desde el endpoint
const fetchStates = async () => {
  try {
    const { data } = await useAPI("/locations/states", {
      default: () => [],
    });
    states.value = data.value;
  } catch (error) {
    console.error("Error al cargar los departamentos:", error);
  }
};

// Función para obtener las provincias desde el endpoint
const fetchCities = async (stateId: string) => {
  try {
    const { data } = await useAPI(`/locations/states/${stateId}/cities`, {
      default: () => [],
    });
    cities.value = data.value;
  } catch (error) {
    console.error(
      `Error al cargar las provincias del departamento ${stateId}:`,
      error
    );
  }
};

// Función para obtener los distritos desde el endpoint
const fetchDistricts = async (cityId: string) => {
  try {
    const { data } = await useAPI(`/locations/cities/${cityId}/districts`, {
      default: () => [],
    });
    districts.value = data.value;
  } catch (error) {
    console.error("Error al cargar actividades económicas:", error);
  }
};

watchEffect(() => {
  fetchEconomicActivities();
  fetchStates();
});

const handleStateChange = (stateId: string) => {
  cities.value = []; // Limpiar las provincias
  districts.value = []; // Limpiar los distritos
  fetchCities(stateId);
};

const handleCityChange = (cityId: string) => {
  districts.value = []; // Limpiar los distritos
  fetchDistricts(cityId);
};

watch(
  () => props.organization,
  (newOrganization) => {
    form.resetForm({
      values: newOrganization || {},
    });
  }
);

watch(form.values, (newValues) => {
  console.log("Form values:", newValues);
  console.log("Attached Files:", newValues.attachedFiles); // Revisa este log
});

const onSubmit = form.handleSubmit((values) => {
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
  console.log("submit", formattedValues);
  props.onsubmit(formattedValues);
});

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name);
};
</script>

<template>
  <SheetHeader>
    <SheetTitle>{{
      props.organization
        ? "Actualizar datos de organización"
        : "Registrar organización"
    }}</SheetTitle>
  </SheetHeader>

  <div class="border-primary border-t-[1px]"></div>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form class="flex flex-col gap-4 flex-grow p-1" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="attachedFiles">
        <FormItem>
          <FormControl>
            <InputFile
              v-model="form.values.attachedFiles"
              @update:value="handleFilesChange"
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

      <h2 class="text-primary text-base font-normal leading-5">Ubicación</h2>
      <!-- Departamento -->
      <FormField v-slot="{ componentField }" name="department">
        <FormItem>
          <FormControl>
            <Select
              v-bind="componentField"
              @update:modelValue="handleStateChange(componentField.modelValue)"
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
                @update:modelValue="handleCityChange(componentField.modelValue)"
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
              <Select v-bind="componentField" :disabled="!form.values.province">
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

      <!-- Botón de Submit -->
      <!-- <Button type="submit">Guardar</Button> -->
      <SheetFooter class="mt-auto">
        <SheetClose as-child>
          <Button
            type="submit"
            :disabled="!form.meta.value.valid"
            :class="
              cn(
                'w-full',
                !form.meta.value.valid
                  ? 'text-primary bg-bgtheme'
                  : 'hover:text-primary hover:bg-bgtheme'
              )
            "
          >
            {{ props.organization ? "Actualizar datos" : "Registrar" }}
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
