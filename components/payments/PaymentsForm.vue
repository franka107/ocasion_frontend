<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { X } from "lucide-vue-next";
import {
  SheetClose,
} from '@/components/ui/sheet' // 

const props = defineProps<{
  id: number | undefined; 
  onSubmit: (values: any) => void;
  closeModal: () => void;
}>();

const formSchema = toTypedSchema(
  z.object({
    comments: z.string().min(1, "El comentario es requerido.")
    .max(500, "El comentario no puede exceder los 500 caracteres."),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    comments: "",
  },
});
watch(form.values, (newValues) => {
  console.log("Form values:", newValues);
  console.log(form.errors.value);
});


const onSubmit = form.handleSubmit(async (values:any) => {
    console.log( "id", props.id)
  const formattedValues = {
    paymentId: props.id, 
    reason: values.comments, 
  };
    props.onSubmit(formattedValues);
});

</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">Observar abono</SheetTitle>
  </SheetHeader>

  <div class="flex-grow flex flex-col">
    <form class="h-full" @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 h-full">
        <!-- Fields -->
        <FormField v-slot="{ componentField }" name="comments">
          <FormItem>
            <FormControl>
              <Textarea
              type="text"
              label="Comentarios"
              v-bind="componentField"
            />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </section>
      <SheetFooter class="flex gap-x-4 px-6">
        <Button
         type="button" 
          class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent w-[200px]" 
          size="xll"
           @click="props.closeModal"
        >
          Cancelar
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
