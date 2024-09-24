<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { X } from "lucide-vue-next";
import {
  SheetClose,
} from '@/components/ui/sheet' // 
import InputFile from "@/components/common/file/Input.vue";
import type { DeliveryDetail, DeliveryDetailFile } from "@/types/Evidence.ts";
import dayjs from "dayjs";
const BASE_EVIDENCE_URL = "/delivery-management";
const props = defineProps<{
  id: string | undefined;
  onEdit: (values: any) => void;
  onConfirm: (values: any) => void;
  closeModal: () => void;
}>();
const currentMode = ref<"edit" | "confirm">("confirm");
const participantDetail = ref<{
  fullName: string,
  document: string,
  phone: string,
  email: string,
}>({
  fullName: "Jose Enriquez Perez",
  document: "DNI 87654321",
  phone: "987654321",
  email: "jenriquezp@gmail.com",
});
const transferenceDetail = ref<{
  date: string;
  time: string;
  location: string;
  comment: string;
  files: DeliveryDetailFile[];
}  | null>(null);

const formSchema = toTypedSchema(
z.object({
  date: z.string().min(1, "La fecha es requerida."),
  time: z.string().min(1, "La hora es requerida."),
  location: z.string().min(1, "El lugar es requerido."),
  comment: z.string().min(1, "El comentario es requerido."),
  files: z
  .array(z.any())
  .min(1, "Debe subir al menos un archivo")
  .max(3, "Puede subir un máximo de un archivo"),
}),
);


try {
  const { data } = await useAPI<DeliveryDetail>(`${BASE_EVIDENCE_URL}/get-delivery-support-detail`, {
    query: { id: props.id },
  } as any);
  
  transferenceDetail.value = {
    date: dayjs(data.value.deliveryDate).format("YYYY-MM-DD"),
    time: dayjs(data.value.deliveryDate).format("HH:mm"),
    location: data.value.deliveryAddress,
    comment: data.value.comment,
    files: data.value.files as any
  };
} catch (error) {
  console.error("Error al cargar el detalle de la transferencia", error);
}
const form = useForm({
  validationSchema: formSchema,
  initialValues: transferenceDetail.value,
});

const onSubmit = async (values:any) => {
  let formattedValues = null
  if(currentMode.value === "edit") {
    const { valid } = await form.validate();
    if(valid) {
      const { date, time, location, comment, files} = form.values;
      dayjs(`${date} ${time}`).format("YYYY-MM-DD");
      formattedValues = {
        id: props.id,
        deliveryAddress:  location,
        deliveryDate: new Date(`${date} ${time}`).toISOString(),
        comment,
        files
      }
      props.onEdit(formattedValues)
    }
  } else if(currentMode.value === "confirm") {
    formattedValues = {
      deliverySupportId: props.id,
    }
    props.onConfirm(formattedValues);
  }
}


</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">Detalle sustento de entrega</SheetTitle>
  </SheetHeader>
  
  <div class="flex-grow flex flex-col">
    <form class="h-full" @submit.prevent="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 h-full">
        <div v-if="transferenceDetail">
          <section class="mb-6" >
            <h3 class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[16px]">DATOS DEL PARTICIPANTE</h3>
            <!-- Datos del Participante -->
            <div class="flex items-center mb-[8px]">
              <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                NOMBRE:
              </div>  
              <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                {{ participantDetail.fullName }}
              </div>
            </div> 
            <div class="flex items-center mb-[8px]">
              <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                DOCUMENTO:
              </div>  
              <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                {{ participantDetail.document }}
              </div>
              <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px] ml-[3px]">
                TELÉFONO:
              </div>  
              <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                {{ participantDetail.phone }}
              </div>
            </div>
            <div class="flex items-center mb-[8px]">
              <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                CORREO:
              </div>  
              <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                {{ participantDetail.email }}
              </div>
            </div>
          </section>
          <section class="mb-6">
            <h3 class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]">INFORMACIÓN DEL SUSTENTO</h3>
            <!-- Información del Sustento -->
            <template v-if="currentMode === 'confirm'">
              <div class="flex items-center mb-[8px]">
                <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                  FECHA:
                </div>  
                <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                  {{ transferenceDetail.date  }}
                </div>
                <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px] ml-[24px]">
                  HORA:
                </div>  
                <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                  {{ transferenceDetail.time }}
                </div>
              </div>
              <div class="flex items-center mb-[8px]">
                <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                  LUGAR:
                </div>  
                <div class="text-sm text-[#000000] font-[400] tracking-[0.3px] ml-[4px]">
                  {{ transferenceDetail.location }}
                </div>
              </div>
              <div class="">
                <div class="font-[700] text-[#20445E] text-[14px] tracking-[0.2px]">
                  COMENTARIO:
                </div>  
                <div class="text-sm text-[#000000] font-[400] tracking-[0.3px]">
                  {{ transferenceDetail.comment }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col gap-4 flex-grow">
                <div class="flex gap-2">
                  <!-- Fecha -->
                  <FormField v-slot="{ componentField }" name="date">
                    <FormItem class="w-1/2">
                      <FormControl>
                        <DateInput
                          label="Fecha"
                          @update:modelValue="componentField.onChange"
                          :value="componentField.modelValue"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <!-- Hora-->
                  <FormField v-slot="{ componentField }" name="time">
                    <FormItem class="w-1/2">
                      <FormControl>
                        <CustomInput
                        type="text"
                        label="Hora"
                        v-bind="componentField"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </div>
                <FormField v-slot="{ componentField }" name="location">
                  <FormItem>
                    <FormControl>
                      <CustomInput
                      type="text"
                      label="Lugar"
                      v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="comment">
                  <FormItem>
                    <FormControl>
                      <Textarea
                      type="text"
                      label="Comentarios"
                      v-bind="componentField"
                      />
                      <FormMessage />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </template>
          </section>
          <section class="mb-6">
            <h3 class="tracking-[1px] font-[600] text-[#152A3C] text-[14px] leading-5 mb-[12px]">ARCHIVOS SUBIDOS</h3>
            <!-- Fields -->
            <FormField v-slot="{ componentField }" name="files">
              <FormItem>
                <FormControl>
                  <InputFile
                  title="Archivo"
                  :disabled="currentMode === 'confirm'"
                  :hideRemoveIcon="currentMode === 'confirm'"
                  v-model="form.values.files"
                  v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </section>
        </div>
        
      </section>
      <SheetFooter class="flex gap-x-4 px-6">
        <template v-if="currentMode === 'confirm'">
          <Button
            type="button" 
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[200px]" 
            size="xll"
            @click="currentMode = 'edit'"
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
        </template>
        <template v-else>
          <Button
            type="submit"
            :disabled="!form.meta.value.valid"
            class="text-[16px] font-[600] w-full" 
            size="xll"
          >
            Guardar documentos
          </Button>
        </template>
      </SheetFooter>
    </form>
  </div>
</template>
