<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import InputFile from "@/components/common/file/Input.vue";
import { X } from "lucide-vue-next";

const props = defineProps<{
  eventId: string;
  onsubmit: (values: any) => void;
}>();

const formSchema = toTypedSchema(
  z.object({
    cancellationReason: z
      .string()
      .min(1, "La razon de cancelacion es requerida."),
  }),
);
const form = useForm({ validationSchema: formSchema });

const onSubmit = form.handleSubmit((values: any) => {
  const formattedValues = {
    ...values,
    eventId: props.eventId,
  };

  props.onsubmit(formattedValues);
});
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">
      Cancelar evento
    </SheetTitle>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form
      class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5"
      @submit="onSubmit"
    >
      <FormField v-slot="{ componentField }" name="cancellationReason">
        <FormItem>
          <FormControl>
            <Textarea
              rows="5"
              type="text"
              label="Notas de cancelación"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
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
          {{ "Cancelar evento" }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
