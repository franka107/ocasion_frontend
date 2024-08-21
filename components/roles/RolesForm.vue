<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const props = defineProps<{ id: number | undefined, onsubmit: (values: any) => void }>();
const functionalities = [
  { id: 'funcion01', label: 'Función 01' },
  { id: 'funcion02', label: 'Función 02' },
  { id: 'funcion03', label: 'Función 03' },
  { id: 'funcion04', label: 'Función 04' },
  { id: 'funcion05', label: 'Función 05' },
  { id: 'funcion06', label: 'Función 06' },
  { id: 'funcion07', label: 'Función 07' },
  { id: 'funcion08', label: 'Función 08' },
  { id: 'funcion09', label: 'Función 09' },
  { id: 'funcion10', label: 'Función 10' }
]
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, "El nombre del rol es requerido."),
    description: z.string().min(1, "La descripción es requerida."),
    status: z.enum(["activo", "desactivo"], {
      required_error: "El estado es requerido.",
    }),
    functionalities: z.array(z.string()).min(1, "Debe seleccionar al menos una funcionalidad."),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    description: "",
    status: "activo",
    functionalities: []
  },
});

const onSubmit = form.handleSubmit((values) => {
  const formattedValues = {
    ...values,
    id: props.id,
  };
  props.onsubmit(formattedValues);
});
</script>

<template>
  <SheetHeader>
    <SheetTitle>{{ props.id ? "Editar rol" : "Crear rol" }}</SheetTitle>
  </SheetHeader>

  <div class="border-primary border-t-[1px]"></div>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col p-1">
    <form class="flex flex-col gap-4 flex-grow" @submit="onSubmit">
      <!-- Fields -->
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Nombre"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormControl>
            <Input class="h-[85px] "
              type="text"
              placeholder="Descripción"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <FormField v-slot="{ componentField }" name="status">
        <FormItem>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="desactivo">Desactivo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      
      <h2>Funcionalidades</h2>
      <Input type="text" placeholder="Buscar" />
      
      <div v-for="func in functionalities" :key="func.id" class="flex items-center space-x-2">
        <Checkbox :id="func.id" :value="func.id" v-model="form.values.functionalities"/>
        <label
          :for="func.id"
          class="text-[16px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ func.label }}
        </label>
      </div>

      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="cn('w-full', !form.meta.value.valid ? 'text-primary bg-bgtheme' : 'hover:text-primary hover:bg-bgtheme')"
        >
          {{ props.id ? "Actualizar rol" : "Crear rol" }}
        </Button>
      </SheetFooter>
    </form>
  </div>
</template>
