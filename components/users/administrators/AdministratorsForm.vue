<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import type { IAdminsLItem } from '@/types/Administrators';
import { X } from "lucide-vue-next";
import CustomSelect from "~/components/ui/custom-select/CustomSelect.vue";

const BASE_ADM_URL = "/user-management";
const props = defineProps<{
  userId: number | undefined;
  onSubmit: (values: any) => void;
}>();

const formSchema = toTypedSchema(
  z.object({
    fullName: z.string().min(2, "El nombre y apellidos es requerido").max(100),
    documentType: z.string().min(1, "Tipo de documento es requerido"),
    documentIdentifier: z.string()
      .regex(/^\d+$/, "Este campo debe contener solo dígitos.")
      .length(9, "El número de documento debe de ser 9 dígitos"),
    phoneNumber: z.string().min(1, "El número de celular es requerido"),
      email: z
      .string()
      .email("El correo electrónico no es válido")
      .optional()
      .nullable(),
    type: z.string().min(1, "Tipo de usuario es requerido"),
    organization: z.string().min(1, "La organización es requerida"),
    userRole: z.array(z.string()).min(1, "El rol de usuario es requerido"),
  }),
);
interface AdminsForm extends IAdminsLItem {
  addressLine1?: string;
}

const test = ref<any>([]);
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    fullName: '',
    documentType: '',
    documentIdentifier: '',
    phoneNumber: '',
    email: '',
    type: '',
    organization: '',
    userRole: [],
  }
});
const userTypes = ref<Array<{ id: string; name: string }>>([]);

const fetchUserTypes = async () => {
  try {
    const { data } = await useAPI("/user-management", { default: () => [] });
    const typesSet = new Set(data.value.map((user: any) => user.type));
    userTypes.value = Array.from(typesSet).map(type => ({
      id: type, 
      name: type 
    }));
  } catch (error) {
    console.error("Error al cargar los tipos de usuario:", error);
  }
};

</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.userId
        ? "Actualizar datos de usuario"
        : "Crear usuario"
    }}</SheetTitle>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <!-- <form @submit="onSubmit"> -->
      <form class="flex flex-col gap-4 flex-grow p-5" @submit="onSubmit">
        <!-- Nombre Completo -->
        <FormField v-slot="{ componentField }" name="fullName">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Nombre y apellidos"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex gap-2">
        <!-- Tipo de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="documentType"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="px-2">
                    <SelectValue placeholder="Tipo de Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">CE</SelectItem>
                      <SelectItem value="PT">PT</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Número de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="documentIdentifier"
          >
            <FormItem class="w-1/2">
              <FormControl>
                <Input
                  type="text"
                  placeholder="N° documento"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Teléfono -->
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Número de celular"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Correo de Facturación -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Correo"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Tipo de Usuario -->
        <FormField v-slot="{ componentField }" name="type">
          <FormItem>
            <FormControl>
              <Select
                v-bind="componentField"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Usuario" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                      <SelectItem value="type">SUPER_ADMIN</SelectItem>
                      <SelectItem value="type">ORGANIZATION_ADMIN</SelectItem>
                      <SelectItem value="type">PLATFORM_USER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Organización -->
        <FormField v-slot="{ componentField }" name="organization">
          <FormItem>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger>
                  <SelectValue placeholder="Organización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                      <SelectItem value="Organización">Organización</SelectItem>
                    </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      <!-- Rol Usuario -->
      <FormField v-slot="{ componentField }" name="userRole">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                multiple
                :items="[{ id: 'rol', name: 'Rol Usuario'}, { id: 'rol2', name: 'Rol Usuaro2'}, { id: 'ro3l', name: 'Rol Usuario3'}]"
                placeholder="Rol Usuario" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </form>

      <!-- Botón de Submit -->
      <!-- <Button type="submit">Guardar</Button> -->
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
          {{ props.userId ? "Actualizar datos" : "Registrar" }}
        </Button>
      </SheetFooter>
    <!-- </form> -->
    <!-- </Form> -->
  </div>
</template>
