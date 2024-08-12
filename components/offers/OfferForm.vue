<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { IEventLItem } from '@/types/Event';
import { eventType, goodType, eventTimes, years } from "@/constants/events";
const BASE_OFFERS_URL = '/offer-management'
let form: any;
const {getEvent} = useEvent();
const props = defineProps<{id: string | undefined, orgRucNumber: string,  onsubmit: (values: any) => void;}>();
const { fetchCities, fetchDistricts, fetchStates, states, cities, districts } = useAddress()
const { brands: brandOptions, models: modelOptions, fetchBrands, fetchModels } = useExtraEndpoints()
// const yearOptions = Array.from({ length: 65 }, (_, i) => ({ id: 1960 + i, name: (1960 + i).toString() }))
const formSchema = toTypedSchema(
  z.object({
    annexesFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo de bien."),
    attachedFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo de bien."),
      brandId: z.string().min(1, "El modelo es requerido."),
    title: z.number().min(1960 , "El titulo es requerido.").max(200, "Cant. de carácteres máximo 200."),
    carModel: z.string().min(1, "El modelo es requerido."),
    year: z.number().min(1960 , "El Año minimo es 1960.").max(2025, "El Año maximo es 2025."),
    description: z.string().min(1, "La descripcion es requerido."),
    addressLine1: z.string().min(1, "La dirección es requerida."),
    apprasial: z.string().min(1, "La fecha de fin es requerida."),
  })
);
if (props.id) {
      const { data: organizationData } = await getEvent(props.id);
        
      form = useForm({
        validationSchema: formSchema,
        initialValues: organizationData.value,
      });
} else {
      await Promise.all([fetchBrands(), fetchStates()]);
      form = useForm({ validationSchema: formSchema });
}


const handleStateChange = (stateId: string) => {
  cities.value = []; // Limpiar las provincias
  districts.value = []; // Limpiar los distritos
  fetchCities(stateId);
};

const handleBrandChange = (brandId: string) => {
  modelOptions.value = []; // Limpiar las provincias
  fetchModels(brandId);
};
const handleCityChange = (cityId: string) => {
  districts.value = []; // Limpiar los distritos
  fetchDistricts(cityId);
};

const onSubmit = form.handleSubmit((values: any) => {
  const { ...restValues } =
    values;

  const formattedValues = {
    ...restValues,
    organization: {
        rucNumber: props.orgRucNumber,
    },
  };
  if (props.id) {
    formattedValues.id = props.id;
  }
  console.log(formattedValues);
  // props.onsubmit(formattedValues);
  
});

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name);
};
</script>

<template>
  <SheetHeader>
    <SheetTitle>{{
      props.id
        ? "Actualizar oferta"
        : "Crear oferta"
    }}</SheetTitle>
  </SheetHeader>

  <div class="border-primary border-t-[1px]"></div>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form class="flex flex-col gap-4 flex-grow p-1" @submit="onSubmit">
      <div class="flex gap-2">
        <FormField v-slot="{ componentField }" name="goodFiles">
        <FormItem>
          <FormControl>
            <InputFile
                title="Anexos"
                instructionsText="(xlsx, docx, pdf)"
                v-model="form.values.goodFiles"
                @update:value="handleFilesChange"
                v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="termsAndConditionsFiles">
        <FormItem>
          <FormControl>
            <InputFile
                title="Fotos y videos"
                instructionsText="(Mp4, jpg, png)"
                v-model="form.values.attachedFiles"
                @update:value="handleFilesChange"
                v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      </div>  
      <h2 class="text-primary text-base font-normal leading-5">
        Producto ofertado
      </h2>
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Título de la oferta"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="grid grid-cols-[1fr,_1fr,_0.75fr] gap-x-1">
        <FormField v-slot="{ componentField }" name="brandId">
        <FormItem>
          <FormControl>
            <Select v-bind="componentField" 
            @update:modelValue="handleBrandChange(componentField.modelValue)">
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="brand in brandOptions"
                    :key="brand.id"
                    :value="brand.id"
                  >
                    {{ brand.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="model">
        <FormItem>
          <FormControl>
            <Select v-bind="componentField" :disabled="!form.values.brandId">
              <SelectTrigger>
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="model in modelOptions"
                    :key="model.id"
                    :value="model.id"
                  >
                    {{ model.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="year">
        <FormItem>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="year in years"
                    :key="year.id"
                    :value="String(year.id)"
                  >
                    {{ year.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      </div>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Descripcion del bien"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
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
      <h2 class="text-primary text-base font-normal leading-5">Puesta en valor</h2>
      <div class="flex gap">
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
      </div>
      <!-- Botón de Submit -->
      <!-- <Button type="submit">Guardar</Button> -->
      <SheetFooter class="mt-auto">
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
            {{ props.id ? "Actualizar evento" : "Crear evento" }}
          </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
