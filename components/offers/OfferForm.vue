<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import type { OfferItem } from '@/types/Offer';
import { Textarea } from '@/components/ui/textarea'
import { eventType, goodType, eventTimes, years } from "@/constants/events";
const BASE_OFFERS_URL = '/offer-management'
import { X } from "lucide-vue-next";
let form: any;
const { getOffer } = useOfferAPI();
const props = defineProps<{id: string | undefined, eventId: string, rucId: string,  onsubmit: (values: any) => void;}>();
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
    title: z.string().min(1 , "El titulo es requerido.").max(200, "Cant. de carácteres máximo 200."),
    brandId: z.string().min(1, "El modelo es requerido."),
    model: z.string().min(1, "El modelo es requerido."),
    year: z.number().min(1,"El año es requerido"),
    districtId: z.string().min(1,"El año es requerido"),
    description: z.string().min(1, "La descripcion es requerido."),
    addressLine1: z.string().min(1, "La dirección es requerida."),
    appraisal: z.number().min(1, "La tasación es requerida."),
  })
);

interface OfferItemForm extends OfferItem {
  department?: string;
  province?: string;
  districtId?: string;
  addressLine1?: string;
  brandId?: string;
  model?: string;
}

if (props.id) {
    // const { data: offerData } = await ;
    const [{ data }]= await Promise.all([getOffer(props.id),fetchBrands(), fetchStates()]);
    const offerData: OfferItemForm = { ...data.value };
    offerData.department = offerData.address?.district?.id.split("+")[0] || "";
    offerData.province =
      `${offerData.department}+${offerData.address?.district?.id.split("+")[1]}` ||
      "";
    offerData.districtId = offerData.address.district.id;
    offerData.addressLine1 = offerData.address.addressLine1;
    offerData.brandId = offerData.carModel.brand.id;
    offerData.model = offerData.carModel.id;
    
    await Promise.all([
      fetchCities(offerData.department),
      fetchDistricts(offerData.province),
      fetchModels(offerData.brandId),
    ]);
    form = useForm({
      validationSchema: formSchema,
      initialValues: offerData,
    });
    
  } else {
    await Promise.all([fetchBrands(), fetchStates()]);
    form = useForm({ validationSchema: formSchema });
}


watch(form.values, (newValues) => {
  console.log("Form values:", newValues, props.rucId);
  console.log("Attached Files:", newValues.attachedFiles); // Revisa este log
});

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
  const { addressLine1, districtId, year, model, ...restValues } = values;

  const formattedValues = {
    ...restValues,
    event: {
      id: props.eventId,
    },
    carModel: {
      id: model,
    },
    year: Number(year),
    address: {
      // id: districtId,
      addressLine1: addressLine1,
      district: {
        id: districtId,
      }
    },
    organization: {
      rucNumber: props.rucId,
    },
    appraisal: Number(values.appraisal),
  };
  if (props.id) {
    formattedValues.id = props.id;
  }
  console.log(formattedValues);
  props.onsubmit(formattedValues);
  
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
      props.id
        ? "Actualizar oferta"
        : "Crear oferta"
    }}</SheetTitle>
  </SheetHeader>


  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="annexesFiles">
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
      <FormField v-slot="{ componentField }" name="attachedFiles">
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
      <h2 class="text-primary text-base font-normal leading-5">
        Producto ofertado
      </h2>
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Título de la oferta"
              :disabled="props.id"
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
            @update:modelValue="(value) => handleBrandChange(value)">
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
                    :value="Number(year.id) as any"
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
              <Textarea
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
              @update:modelValue="(value) => handleStateChange(value)"
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
                @update:modelValue="(value) => handleCityChange(value)"
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
        <FormField v-slot="{ componentField }" name="appraisal">
          <FormItem>
            <FormControl>
              <Input
                type="number"
                :disabled="props.id"
                placeholder="Tasación"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="other">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                disabled
                placeholder="Valor inicial de subasta"
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
