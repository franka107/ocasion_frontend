<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import { SheetClose } from '@/components/ui/sheet' //
import InputFile from '@/components/common/file/Input.vue'
const BASE_EVIDENCE_URL = '/transference-management'
const props = defineProps<{
  id: string | undefined
  onSubmit: (values: any) => void
  closeModal: () => void
}>()

const transferenceDetail = ref<{
  participant: {
    fullName: string
    document: string
    phone: string
    email: string
  }
  supportInfo: {
    date: string
    time: string
    location: string
    comment: string
    files: string[]
  }
} | null>(null)

const formSchema = toTypedSchema(
  z.object({
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(3, 'Puede subir un máximo de un archivo'),
    date: z.string().min(1, 'La fecha es requerida.'),
    time: z.string().min(1, 'La hora es requerida.'),
    location: z.string().min(1, 'El lugar es requerido.'),
    comment: z.string().min(1, 'El comentario es requerido.'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    // attachedFiles: "files",
  },
})
watch(form.values, (newValues) => {
  console.log('Form values:', newValues)
  console.log(form.errors.value)
})

const fetchTransferenceDetail = async (id: string) => {
  try {
    const { data } = await useAPI(
      `${BASE_EVIDENCE_URL}/get-deliveryasd-support-detail`,
      {
        default: () => [],
        query: { id: props.id },
        // query: { id: "a3f7bcd5-421b-4e11-9357-7157a7f7b1f8" },
      },
    )
    // transferenceDetail.value = data.value.map((item: any) => ({
    //   id: item.id,
    //   deliveryDate: new Date(item.deliveryDate).toLocaleString("es-ES", {
    //     day: "2-digit",
    //     month: "2-digit",
    //     year: "numeric",
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //   }),
    //   deliveryAddress: item.deliveryAddress,
    //   files:item.files,
    //   comment: item.comment,
    //   status: item.status,
    //   document: "DNI 87654321",
    //   phone: "987654321",
    //   email: "jenriquezp@gmail.com",
    //   time: "13:35",
    // }));

    transferenceDetail.value = {
      participant: {
        fullName: 'Jose Enriquez Perez',
        document: 'DNI 87654321',
        phone: '987654321',
        email: 'jenriquezp@gmail.com',
      },
      supportInfo: {
        date: '16/09/2024',
        time: '13:35',
        location: 'Nombre del lugar',
        comment:
          'Lorem ipsum dolor sit amet consectetur. Quis donec donec fermentum varius urna in lectus sit. Fames quam nunc vitae hac laoreet sit dui arcu.',
        files: [
          'Nombredocumento.pdf',
          'Nombredocumento.jpg',
          'Nombredocumento.jpg',
          'Nombredocumento.jpg',
          'Nombredocumento.jpg',
        ],
      },
    }
  } catch (error) {
    console.error('Error al cargar el detalle de la transferencia', error)
  }
}
if (props.id) {
  await fetchTransferenceDetail(props.id)
} else {
  console.error('ID no está definido')
}

const onSubmit = form.handleSubmit(async (values: any) => {
  console.log('id', props.id)
  const formattedValues = {
    ...values,
    id: props.id,
  }
  props.onSubmit(formattedValues)
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
    <SheetTitle class="text-xl font-medium text-[#64748B]"
      >Editar transferencia de bienes</SheetTitle
    >
  </SheetHeader>

  <div class="flex-grow flex flex-col">
    <form class="h-full" @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 h-full">
        <div v-if="transferenceDetail">
          <section class="mb-6">
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[16px]"
            >
              DATOS DEL PARTICIPANTE
            </h3>
            <!-- Datos del Participante -->
            <div class="flex items-center mb-[8px]">
              <div
                class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]"
              >
                NOMBRE:
              </div>
              <div
                class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]"
              >
                {{ transferenceDetail.participant.fullName }}
              </div>
            </div>
            <div class="flex items-center mb-[8px]">
              <div
                class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]"
              >
                DOCUMENTO:
              </div>
              <div
                class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]"
              >
                {{ transferenceDetail.participant.document }}
              </div>
              <div
                class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px] ml-[3px]"
              >
                TELÉFONO:
              </div>
              <div
                class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]"
              >
                {{ transferenceDetail.participant.phone }}
              </div>
            </div>
            <div class="flex items-center mb-[8px]">
              <div
                class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]"
              >
                CORREO:
              </div>
              <div
                class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]"
              >
                {{ transferenceDetail.participant.email }}
              </div>
            </div>
          </section>
          <!-- Archivos Subidos -->
          <section class="mb-6">
            <h3
              class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]"
            >
              ARCHIVOS SUBIDOS
            </h3>
            <!-- Fields -->
            <FormField v-slot="{ componentField }" name="attachedFiles">
              <FormItem>
                <FormControl>
                  <InputFile
                    v-model="form.values.attachedFiles"
                    title="Arrastrar o abrir archivo"
                    instructions-text="JPG, PNG,JPEG o PDF Tamaño máx 5MB"
                    :limit-files="5"
                    v-bind="componentField"
                    @update:value="handleFilesChange"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </section>
        </div>
      </section>
      <SheetFooter class="flex gap-x-4 px-6">
        <Button
          type="button"
          class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[200px]"
          size="xll"
          @click="props.closeModal"
        >
          Editar
        </Button>
        <Button
          type="submit"
          class="text-[16px] font-[600] w-[200px]"
          size="xll"
        >
          Confirmar
        </Button>
      </SheetFooter>
    </form>
  </div>
</template>
