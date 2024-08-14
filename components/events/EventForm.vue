<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import { X } from "lucide-vue-next";
import type { IEventLItem } from '@/types/Event';
import { eventType, goodType, eventTimes } from "@/constants/events";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import Textarea from "../ui/textarea/Textarea.vue";
const EVENT_BASE_URL = '/event-management'
let form: any;
const {getEvent} = useEvent();
const props = defineProps<{id: string | undefined, orgRucNumber: string,  onsubmit: (values: any) => void;}>();
const eventTypesOptions = Array.from(eventType).map(([id,name]) => ({ id, name }));
const goodTypeOptions = Array.from(goodType).map(([id,name]) => ({ id, name }));
const eventTimesOptions = Array.from(eventTimes).map(([id,name]) => ({ id: Number(id), name }));
const formSchema = toTypedSchema(
  z.object({
    goodFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo de bien."),
    termsAndConditionsFiles: z
      .array(z.any())
      .min(1, "Debe subir al menos un archivo de tyc."),
    name: z.string().min(1, "El nombre del evento es requerido."),
    description: z.string().min(1, "La descripción es requerida."),
    type: z.string().min(1, "El tipo de evento es requerido."),
    goodType: z.string().min(1, "El tipo de bien es requerido."),
    startDate: z.string().min(1, "La fecha de inicio es requerida."),
    endDate: z.string().min(1, "La fecha de fin es requerida."),
    closingTime: z.number().min(1, "El horario de cierre es requerido."),
  })
);
if (props.id) {
      const { data: organizationData } = await getEvent(props.id);
        
      form = useForm({
        validationSchema: formSchema,
        initialValues: organizationData.value,
      });
} else {
      form = useForm({ validationSchema: formSchema });
}


watch(form.values, (newValues) => {
  console.log("Form values:", newValues);
  console.log("Attached Files:", newValues.attachedFiles); // Revisa este log
});

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
        ? "Actualizar evento"
        : "Crear evento"
    }}</SheetTitle>
  </SheetHeader>


  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="goodFiles">
        <FormItem>
          <FormControl>
            <InputFile
                title="Lista de bienes"
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
                title="Términos y condiciones"
                instructionsText="(xlsx, docx, pdf)"
                v-model="form.values.attachedFiles"
                @update:value="handleFilesChange"
                v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Nombre del evento"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormControl>
            <Textarea
              type="text"
              placeholder="Descripción"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="type">
        <FormItem>
          <FormControl>
            <Select :disabled="!!props.id" v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="activity in eventTypesOptions"
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
      <FormField v-slot="{ componentField }" name="goodType">
        <FormItem>
          <FormControl>
            <Select :disabled="!!props.id" v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Tipo de bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="activity in goodTypeOptions"
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
      <div class="flex gap-2">
        <FormField v-slot="{ componentField }" name="startDate">
          <FormItem class="w-1/2">
            <FormControl>
                <DateInput
                  @update:modelValue="componentField.onChange"
                  label="Fecha de inicio"
                  :value="componentField.modelValue"
                  :minValue="today(getLocalTimeZone()).add({days: 3})"
                />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem class="w-1/2">
            <FormControl>
              <DateInput
                  @update:modelValue="componentField.onChange"
                  label="Fecha de fin"
                  :minValue="
                    form.values.startDate
                      ? parseDate(form.values.startDate)
                      : undefined
                  "
                  :value="componentField.modelValue"
                  :disabled="!form.values.startDate"
                />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <FormField v-slot="{ componentField }" name="closingTime">
        <FormItem>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Horario de cierre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="time in eventTimesOptions"
                    :key="time.id"
                    :value="time.id as any"
                  >
                    {{ time.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <SheetFooter class="mt-auto">
          <Button
            type="submit"
            :disabled="!form.meta.value.valid"
            :class="
            
                          cn(
              'w-full h-10 text-base bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
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
