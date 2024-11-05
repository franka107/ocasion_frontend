<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from "lucide-vue-next";
import { SheetClose } from '@/components/ui/sheet'
import InputFile from '@/components/common/file/Input.vue'
const props = defineProps<{
  id: string | undefined
  personStatus: 'single' | 'married' | 'legal'
  onSubmit: (values: any) => void
}>()
const formSchema = toTypedSchema(
  z.object({
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(5, 'Puede subir un máximo de cinco archivos')
  })
);
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    attachedFiles: []
  }
});
const onSubmit = form.handleSubmit(async (values) => {
  console.log('Valores del formulario:', values)
  props.onSubmit(values)
});

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name)
}
const stepsTitle = computed(() => {
  switch (props.personStatus) {
    case 'single':
      return 'Pasos a seguir para persona soltera:'
    case 'married':
      return 'Pasos a seguir para persona casada:'
    case 'legal':
      return 'Pasos a seguir para persona jurídica:'
    default:
      return 'Pasos a seguir:'
  }
})
</script>

<template>
  <SheetHeader class="flex justify-between">
    <SheetTitle class="text-[16px] md:text-[20px] font-medium text-[#152A3C] leading-[28px] tracking-[-0.5px]">
      Cargar documentos transferencia de bienes
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form class="flex flex-col h-full" @submit="onSubmit">
      <section class="p-5 flex-grow">
        <div
          class="h-auto md:h-[174px] flex flex-col leading-[20px] justify-between mb-4 md:mb-6 text-[#20445E] bg-[#E6F0F8] rounded-[8px] p-4">
          <div>
            <h2 class="text-2 md:text-4 font-[700]">{{ stepsTitle }}</h2>
            <ul class="text-[12px] md:text-[14px] tracking-[0.5px] font-[400]">
              <li>1. Carga de documentos solicitados (deben estar vigentes)</li>
              <li>2. Programación de la firma en notaría</li>
              <li>3. Toma de firma para transferencia del bien</li>
              <li>4. Entrega del bien</li>
            </ul>
          </div>
          <p class="text-[12px] tracking-[0.5px]">
            <span class="font-[700]">Nota:</span> Realizar la carga de documentos en un plazo de 4 días útiles.
          </p>
        </div>
        <div class="leading-[20px]">
          <div class="text-[#152A3C]">
            <h2 class="text-sm font-[600] mb-[8px] uppercase tracking-[0.5px]">Adjuntar documentos</h2>
            <p class="text-xs tracking-[0.5px] leading-[20px]">Adjuntar los siguientes documentos:</p>
            <ul class="mb-4 text-xs tracking-[0.5px] leading-[20px]">
              <li>• Soat vigente</li>
              <li>• Foto de su documento de identidad (frontal y dorsal)</li>
            </ul>
          </div>
          <FormField v-slot="{ componentField }" name="attachedFiles">
            <FormItem>
              <FormControl>
                <InputFile title="Arrastrar o abrir archivo" instructionsText="JPG, PNG, JPEG o PDF Tamaño máx 5MB"
                  :limit-files="5" v-model="form.values.attachedFiles" @update:value="handleFilesChange"
                  v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </section>
      <div class="mt-auto p-6">
        <Button variant="default" :disabled="!form.meta.value.valid" type="submit" class="w-full">
          Cargar documentos
        </Button>
      </div>
    </form>
  </div>
</template>
