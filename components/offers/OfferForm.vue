<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import Input from '../ui/input/Input.vue'
import InputFile from '@/components/common/file/Input.vue'
import type { OfferDto } from '@/types/Offer'
import { Textarea } from '@/components/ui/textarea'
import { eventType, goodType, eventTimes, years } from '@/constants/events'
import type { Organization } from '~/types/Administrators'
const BASE_OFFERS_URL = '/offer-management'
let form: any
const { getOffer } = useOfferAPI()
const props = defineProps<{
  id: string | undefined
  eventId: string
  onsubmit: (values: any) => void
}>()

const {
  brands: brandOptions,
  models: modelOptions,
  fetchBrands,
  fetchModels,
} = useExtraEndpoints()
const initialAuctionAmount = ref('0')
// const yearOptions = Array.from({ length: 65 }, (_, i) => ({ id: 1960 + i, name: (1960 + i).toString() }))
const formSchema = toTypedSchema(
  z.object({
    annexesFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo de bien.'),
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo de bien.'),
    title: z
      .string()
      .min(1, 'El titulo es requerido.')
      .max(200, 'Cant. de carácteres máximo 200.'),
    brandId: z.string().min(1, 'El modelo es requerido.'),
    model: z.string().min(1, 'El modelo es requerido.'),
    year: z.number().min(1, 'El año es requerido'),
    department: z.string().min(1, 'El departamento es requerido'),
    province: z.string().min(1, 'La provincia es requerida'),
    districtId: z.string().min(1, 'El año es requerido'),
    description: z
      .string()
      .min(1, 'La descripcion es requerido.')
      .max(1000, 'Cant. de carácteres máximo 1000.'),
    addressLine1: z.string().min(1, 'La dirección es requerida.'),
    appraisal: z.number().min(1, 'La tasación es requerida.'),
  }),
)
const { fetchCities, fetchDistricts, fetchStates, states, cities, districts } =
  useAddress()

interface OfferItemForm extends OfferDto {
  department?: string
  province?: string
  districtId?: string
  addressLine1?: string
  brandId?: string
  model?: string
}

const BASE_ORG_URL = '/organization-management'

const { data: organizationData } = await useAPI<any>(
  `${BASE_ORG_URL}/get-organization-detail`,
  {
    method: 'GET',
    query: {
      eventId: props.eventId,
    },
  } as any,
)
if (props.id) {
  // const { data: offerData } = await ;

  const { data } = await getOffer(props.id)
  const offerData: OfferItemForm = { ...data.value }
  // offerData.department = offerData.address?.district?.id.split("+")[0] || "";
  // offerData.province =
  //   `${offerData.department}+${offerData.address?.district?.id.split("+")[1]}` ||
  //   "";
  offerData.department = offerData.address.district.city.state.id
  offerData.province = offerData.address.district.city.id
  offerData.districtId = offerData.address.district.id
  offerData.addressLine1 = offerData.address.addressLine1
  offerData.brandId = offerData.carBrand.id
  offerData.model = offerData.carModel.id

  initialAuctionAmount.value =
    (
      offerData.appraisal *
      (organizationData.value.startPercentage / 100)
    ).toFixed(2) || '0'

  await Promise.all([
    fetchCities(offerData.department),
    fetchDistricts(offerData.province),
    fetchBrands(),
    fetchModels(offerData.brandId),
    fetchStates(),
  ])
  form = useForm({
    validationSchema: formSchema,
    initialValues: offerData,
  })
} else {
  await Promise.all([fetchBrands(), fetchStates()])
  form = useForm({ validationSchema: formSchema })
}

console.log('OrganizationData ', organizationData)

watch(form.values, (newValues) => {
  const startPercentage = Number(organizationData.value?.startPercentage) || 0

  initialAuctionAmount.value = (
    newValues.appraisal *
    (startPercentage / 100)
  ).toFixed(2)

  if (isNaN(newValues.appraisal)) {
    initialAuctionAmount.value = '0'
  }
})

const handleStateChange = (stateId: string) => {
  cities.value = [] // Limpiar las provincias
  districts.value = [] // Limpiar los distritos
  fetchCities(stateId)
}

const handleBrandChange = (brandId: string) => {
  modelOptions.value = [] // Limpiar las provincias
  fetchModels(brandId)
}
const handleCityChange = (cityId: string) => {
  districts.value = [] // Limpiar los distritos
  fetchDistricts(cityId)
}

const onSubmit = form.handleSubmit((values: any) => {
  const { addressLine1, districtId, year, model, ...restValues } = values

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
      addressLine1,
      district: {
        id: districtId,
      },
    },

    appraisal: Number(values.appraisal),
  }
  if (props.id) {
    formattedValues.id = props.id
  }
  console.log(formattedValues)
  props.onsubmit(formattedValues)
})

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name)
}
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id ? 'Actualizar oferta' : 'Crear oferta'
    }}</SheetTitle>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form
      class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5"
      @submit="onSubmit"
    >
      <FormField v-slot="{ componentField }" name="annexesFiles">
        <FormItem>
          <FormControl>
            <InputFile
              v-model="form.values.goodFiles"
              title="Anexos"
              instructions-text="Cargar máximo 10 elementos (xlsx, docx, pdf)"
              :limit-files="10"
              v-bind="componentField"
              @update:value="handleFilesChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="attachedFiles">
        <FormItem>
          <FormControl>
            <InputFile
              v-model="form.values.attachedFiles"
              title="Fotos y videos"
              instructions-text="Cargar máximo 12 elementos(mp4, jpg, png)"
              :limit-files="12"
              :accepted-file-types="[
                'image/jpeg',
                'image/png',
                'image/jpg',
                'video/mp4',
              ]"
              v-bind="componentField"
              @update:value="handleFilesChange"
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
            <CustomInput
              type="text"
              label="Título de la oferta"
              v-bind="componentField"
              :disabled="!!props.id"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="grid grid-cols-[1fr,_1fr,_0.75fr] gap-x-1">
        <FormField v-slot="{ componentField }" name="brandId">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                :items="brandOptions"
                placeholder="Marca"
                @update:model-value="(value) => handleBrandChange(value)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="model">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                :disabled="!form.values.brandId"
                :items="modelOptions"
                placeholder="Modelo"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="year">
          <CustomSelect
            v-bind="componentField"
            :items="years"
            placeholder="Año"
          />
        </FormField>
      </div>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormControl>
            <Textarea
              type="text"
              label="Descripción del bien"
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
            <CustomSelect
              v-bind="componentField"
              :items="states"
              placeholder="Departamento"
              @update:model-value="
                (value) => {
                  handleStateChange(value)
                  form.setFieldValue('province', undefined)
                  form.setFieldValue('districtId', undefined)
                }
              "
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
                :disabled="!form.values.department"
                :items="cities"
                placeholder="Provincia"
                @update:model-value="
                  (value) => {
                    form.setFieldValue('districtId', undefined)
                    handleCityChange(value)
                  }
                "
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
      <h2 class="text-primary text-base font-normal leading-5">
        Puesta en valor
      </h2>
      <div class="flex gap-2">
        <FormField v-slot="{ componentField }" name="appraisal">
          <FormItem>
            <FormControl>
              <CustomInput
                type="number"
                :disabled="!!props.id"
                label="Tasación"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <CustomInput
          type="text"
          label="Valor inicial de subasta"
          disabled
          :model-value="initialAuctionAmount"
        />
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
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ props.id ? 'Actualizar oferta' : 'Crear oferta' }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
