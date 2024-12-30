<template>
  <div v-if="formData">
    <div class="py-4 px-10 rounded-xl items-center bg-white w-full">
      <!-- Encabezado con el título y el botón de flecha -->
      <div class="flex justify-between items-center">
        <h3
        class="mb-5 text-sm text-[#676767] transition-all duration-300 w-full"
        :class="{
          'transform translate-x-[45%]': !showContent,
          'translate-x-0': showContent
        }"
      >
        Datos de la oferta
      </h3>
        <button
          @click="toggleContent"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 transform transition-transform duration-200"
            :class="showContent ? 'rotate-180' : 'rotate-0'"
          >
            <path
              fill-rule="evenodd"
              d="M12 15.5a.75.75 0 01-.53-.22l-6-6a.75.75 0 111.06-1.06L12 13.69l5.47-5.47a.75.75 0 111.06 1.06l-6 6a.75.75 0 01-.53.22z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Contenido desplegable -->
      <div v-show="showContent" class="transition-all duration-300">
        <div class="grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-6">
          <div>
            <div class="grid grid-cols-[repeat(auto-fill,_minmax(240px,1fr))] md:grid-cols-2 gap-5">
              <InputWithLabel read-field label="Título de la oferta" :model-value="formData.title" />
              <InputWithLabel read-field label="Marca" :model-value="formData.carBrand?.name" />
              <div class="grid grid-cols-[repeat(auto-fill,_minmax(120px,1fr))] md:grid-cols-2 gap-5">
                <InputWithLabel read-field label="Modelo" :model-value="formData.carModel?.name" />
                <InputWithLabel read-field label="Año" :model-value="formData.year" />
              </div>
              <InputWithLabel read-field label="Tasación" :model-value="formData.appraisal" />
              <InputWithLabel read-field label="Descripción" :model-value="formData.description" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { OfferDto } from '@/types/Offer'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import InputFile from '@/components/common/file/Input.vue'

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

const showContent = ref(true)


const toggleContent = () => {
  showContent.value = !showContent.value
}

const loadInitialData = async () => {
  const { data } = await getOffer(props.id)
  const offerData: OfferDetailForm = { ...data.value }
  return offerData
}

onMounted(async () => {
  formData.value = await loadInitialData()
})
</script>

<style scoped>

button svg {
  transition: transform 0.2s ease-in-out;
  border: 0.5px solid gray;
  border-radius: 20%;
}
</style>
