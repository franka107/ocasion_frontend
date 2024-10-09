<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

import { X } from "lucide-vue-next";
import CustomComboboxMultipleInput from "../ui/custom-combobox-multiple-input/CustomComboboxMultipleInput.vue";
const props = defineProps<{
  id: number | undefined;
  type: "platform" | "organization";
  onsubmit: (values: any) => void;
}>();
const allGrants = ref<Array<{ id: string; name: string }>>([]);
const fetchGrants = async () => {
  try {
    const { data } = await useAPI(
      "/role-configuration/find-grants",
      {
        params: {
          type: props.type,
        },
        default: () => [],
      },
      true,
    );
    allGrants.value = data.value;
  } catch (error) {
    console.error("Error al cargar grants:", error);
  }
};
await fetchGrants();

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "El nombre del rol es requerido."),
    description: z.string().min(1, "La descripción es requerida."),
    status: z.enum(["ACTIVE", "INACTIVE"], {
      required_error: "El estado es requerido.",
    }),
    grantIds: z
      .array(z.string())
      .min(1, "Debe seleccionar al menos una funcionalidad."),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    description: "",
    status: "ACTIVE",
    grantIds: [],
  },
});
watch(form.values, (newValues) => {
  console.log("Form values:", newValues);
  console.log(form.errors.value);
});

const onSubmit = form.handleSubmit((values) => {
  const formattedValues = {
    ...values,
    id: props.id,
  };
  props.onsubmit(formattedValues);
});

if (props.id) {
  const { data } = await useAPI<any>(`role-configuration/get-role-detail`, {
    method: "GET",
    query: {
      id: props.id,
    },
  } as any);
  console.log(data.value);
  form.setValues(data.value);
}
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id ? "Actualizar rol" : "Registrar rol"
    }}</SheetTitle>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form class="h-full" @submit="onSubmit">
      <section class="flex flex-col gap-4 flex-grow p-5 h-full">
        <!-- Fields -->
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Nombre"
                v-bind="componentField"
                :disabled="!!props.id"
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
                label="Descripción"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                :items="[
                  { id: 'ACTIVE', name: 'Activo' },
                  { id: 'INACTIVE', name: 'Desactivo' },
                ]"
                placeholder="Estado"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <h2>Funcionalidades</h2>

        <FormField name="grantIds">
          <FormItem>
            <FormField
              v-for="item in allGrants"
              v-slot="{ value, handleChange }"
              :key="item.id"
              type="checkbox"
              :value="item.id"
              :unchecked-value="false"
              name="grantIds"
            >
              <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    :checked="(value || []).includes(item.id)"
                    @update:checked="handleChange"
                  />
                </FormControl>
                <FormLabel class="font-normal">
                  {{ item.name }}
                </FormLabel>
              </FormItem>
            </FormField>
          </FormItem>
        </FormField>

        <!-- <FormField v-slot="{ componentField }" name="grants"> -->
        <!--   <FormItem> -->
        <!--     <FormControl class="w-full"> -->
        <!--       <CustomComboboxMultipleInput -->
        <!--         @update:modelValue="componentField.onChange" -->
        <!--         label="Funcionalidades" -->
        <!--         class="w-full" -->
        <!--         :options=" -->
        <!--           grants.map((e) => ({ -->
        <!--             value: e.id, -->
        <!--             label: e.name, -->
        <!--           })) -->
        <!--         " -->
        <!--         :value="componentField.modelValue" -->
        <!--       /> -->
        <!--     </FormControl> -->
        <!--     <FormMessage /> -->
        <!--   </FormItem> -->
        <!-- </FormField> -->
        <!-- <Input type="text" placeholder="Buscar" /> -->

        <!-- <div -->
        <!--   v-for="func in grants" -->
        <!--   :key="func.id" -->
        <!--   class="flex items-center space-x-2" -->
        <!-- > -->
        <!--   <Checkbox -->
        <!--     :id="func.id" -->
        <!--     :value="func.id" -->
        <!--     @update:checked="handleChange" -->
        <!--   /> -->
        <!--   <label -->
        <!--     :for="func.id" -->
        <!--     class="text-[16px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" -->
        <!--   > -->
        <!--     {{ func.name }} -->
        <!--   </label> -->
        <!-- </div> -->
      </section>

      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full h-10 text-base bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ props.id ? "Actualizar rol" : "Crear rol" }}
        </Button>
      </SheetFooter>
    </form>
  </div>
</template>
