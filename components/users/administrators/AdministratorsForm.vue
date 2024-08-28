<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import type { IAdminsLItem } from '@/types/Administrators';
import { userType } from '~/constants/administrators';

import { X } from "lucide-vue-next";
import CustomSelect from "~/components/ui/custom-select/CustomSelect.vue";
import type { Organization } from '@/types/Administrators';
import AdministratorsForm from '~/components/users/administrators/AdministratorsForm.vue';

const BASE_ADM_URL = "/user-management";
const BASE_ORG_URL = "/organization-management";
const BASE_ROLE_URL = '/role-configuration';
let form: any;
const {getUser} = useAdmins();
const props = defineProps<{
  id: number | undefined;
  onSubmit: (values: any) => void;
}>();
const userTypesOptions = Array.from(userType).map(([id,name]) => ({ id, name }));
const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
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
    organizations: z.union([z.array(z.string()).min(1, "La organización es requerida"), z.string().min(1, "La organización es requerida")]),
    roles: z.array(z.string()).min(1, "El rol de usuario es requerido"), 
  }),
);
interface AdministratorsForm extends Omit<IAdminsLItem,"organizations" | "roles"> {
  organizations?:string[];
  roles?: string[];
}

if (props.id) {
      const { data: userData } = await getUser(props.id);
      const organizationsFormatted = userData.value.organizations.map((item )=> item.rucNumber)
      const rolesFormatted = userData.value.roles?.map((item )=> item.id)
      const userDataFormatted :  AdministratorsForm = { ...userData.value, organizations: organizationsFormatted, roles: rolesFormatted };    
 
      form = useForm({
        validationSchema: formSchema,
        initialValues: userDataFormatted,
      });
} else {
      form = useForm({ validationSchema: formSchema });
}
const isOrgSimpleSelect = computed(() => ["ORGANIZATION_ADMIN", "ORGANIZATION_USER"].includes(form.values.type));

const organizations = ref<Array<Organization>>([]);
const roles = ref<Array<{ id: string; name: string }>>([]);

const fetchOrganizations = async () => {
  try {
    const { data } = await useAPI(`${BASE_ORG_URL}/find-organizations`, {
      default: () => [],
    });
    organizations.value = data.value.map((org: any) => ({
      rucNumber: org.rucNumber,
      name: org.name
    }));
  } catch (error) {
    console.error("Error al cargar organizaciones:", error);
  }
};

const fetchRoles = async () => {
  try {
    const { data } = await useAPI(`${BASE_ROLE_URL}/find-roles`, {
      default: () => [],
    });
    roles.value = data.value; 
  } catch (error) {
    console.error("Error al cargar roles:", error);
  }
};
if (props.id) {
  await Promise.all([
    fetchOrganizations(),
    fetchRoles()
  ]);
} else {
  await Promise.all([fetchOrganizations(), fetchRoles()]);
}

const formattedOrganizations = computed(() => {
  return organizations.value.map(org => ({
    id: org.rucNumber,
    name: org.name
  }));
});

const onSubmit = form.handleSubmit((values: any) => {
  const { organizations, roles, ...restValues } = values;
  const organizationFormatted =  Array.isArray(organizations) ? organizations : [organizations];
  const formattedValues = {
    ...restValues,
    organizations: organizationFormatted.map((orgRucNumber: string) => ({
      rucNumber: orgRucNumber,
    })),
    roles: roles.map((roleId: string) => ({
      id: roleId,
    })),
  };

  if (props.id) {
    formattedValues.id = props.id;
  }

  props.onSubmit(formattedValues);
});

</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id
        ? "Actualizar datos de usuario"
        : "Crear usuario"
    }}</SheetTitle>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
      <form class="flex flex-col gap-4 flex-grow p-5" @submit="onSubmit">
       
        <div class="flex gap-2">
        <!-- Nombre  -->
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem class="w-1/2">
            <FormControl>
              <Input
                type="text"
                placeholder="Nombres"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Apellido-->
        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem class="w-1/2">
            <FormControl>
              <Input
                type="text"
                placeholder="Apellidos"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        </div>

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
              <CustomSelect
                v-bind="componentField"
                @update:model-value="form.setFieldValue('organizations', isOrgSimpleSelect ? '': []);"
                :items="userTypesOptions"
                placeholder="Tipo de Usuario" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Organización -->        
        <FormField v-slot="{ componentField }" name="organizations">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                :multiple="!isOrgSimpleSelect"
                :items="formattedOrganizations"
                placeholder="Organización" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      <!-- Rol Usuario -->
      <FormField v-slot="{ componentField }" name="roles">
          <FormItem>
            <FormControl>
              <CustomSelect
                v-bind="componentField"
                multiple
                :items="roles"
                placeholder="Rol Usuario" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Botón de Submit -->
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
          {{ props.id ? "Actualizar datos" : "Crear usuario" }}
        </Button>
      </SheetFooter>
      </form>
      
  </div>
</template>
