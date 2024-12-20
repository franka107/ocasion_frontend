<template>
  <div v-if="formData">
    <div class="py-4 px-10 rounded-xl items-center bg-white w-full">
      <div class="grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-6">
        <div>
          <h3 class="mb-5 text-sm text-[#676767]">Datos de la oferta</h3>
          <div class="grid grid-cols-[repeat(auto-fill,_minmax(240px,1fr))] md:grid-cols-2 gap-5">
            <InputWithLabel
              read-field
              label="Título de la oferta"
              :model-value="formData.title"
            />
            <InputWithLabel
              read-field
              label="Marca"
              :model-value="formData.carBrand?.name"
            />
            <div class="grid grid-cols-[repeat(auto-fill,_minmax(120px,1fr))] md:grid-cols-2 gap-5">
              <InputWithLabel
                read-field
                label="Modelo"
                :model-value="formData.carModel?.name"
              />
              <InputWithLabel
                read-field
                label="Año"
                :model-value="formData.year"
              />
            </div>
            <InputWithLabel
              read-field
              label="Tasación"
              :model-value="formData.appraisal"
            />
            <InputWithLabel
              read-field
              label="Descripción"
              :model-value="formData.description"
            />
            <InputWithLabel
              read-field
              label="Departamento"
              :model-value="formData.address?.district?.city?.state?.name"
            />
            <InputWithLabel
              read-field
              label="Provincia"
              :model-value="formData.address?.district?.city?.name"
            />
            <InputWithLabel
              read-field
              label="Distrito"
              :model-value="formData.address?.district?.name"
            />
            <InputWithLabel
              read-field
              label="Dirección"
              :model-value="formData.address?.addressLine1"
            />
          </div>
        </div>
        <div>
          <h3 class="mb-5 text-sm text-[#676767]">Archivos subidos</h3>
          <FormField name="attachedFiles">
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="formData.attachedFiles"
                  disabled
                  hide-remove-icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { OfferDto } from '@/types/Offer'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import InputFile from '@/components/common/file/Input.vue'
import FakeInput from '~/components/auth/FakeInput.vue'

const router = useRouter()
const props = defineProps<{
  id: string
}>()

const { getOffer } = useOfferAPI()

interface OfferDetailForm extends OfferDto {
  title: string
  description: string
  brandId?: string
  model?: string
  year?: number
  department?: string
  province?: string
  districtId?: string
  addressLine1?: string
  appraisal: number
  attachedFiles?: string[]
  goodFiles?: string[]
}

const formData = ref<OfferDetailForm | null>(null)

const loadInitialData = async () => {
  const { data } = await getOffer(props.id)
  const offerData: OfferDetailForm = { ...data.value }
  return offerData
}

onMounted(async () => {
  formData.value = await loadInitialData()
})
</script>
