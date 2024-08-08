<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const formSchema = toTypedSchema(
  z.object({
    fullName: z.string().min(2, "El nombre y apellidos es requerido").max(100),
    documentType: z.string().min(1, "El tipo de documento es requerido"),
    documentNumber: z.string().min(1, "El N° documento es requerido"),
    phoneNumber: z.string().min(1, "El número de celular es requerido"),
    email: z.string().email("El correo electrónico no es válido"),
    userType: z.string().min(1, "El tipo de usuario es requerido"),
    organization: z.string().min(1, "La organización es requerida"),
    userRole: z.string().min(1, "El rol de usuario es requerido"),
  })
);

const { handleSubmit, meta } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  console.log("submit");
});
</script>

<template>
  <SheetContent class="flex flex-col h-full">
    <SheetHeader>
      <SheetTitle>Crear usuario</SheetTitle>
    </SheetHeader>

    <div class="border-primary border-t-[1px]"></div>

    <form class="flex flex-col gap-4 flex-grow p-1" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="fullName">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Nombre y Apellidos"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex gap-2">
        <FormField v-slot="{ componentField }" name="documentType">
          <FormItem class="w-1/2">
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="p-2">
                  <SelectValue
                    placeholder="Tipo de documento"
                    class="text-left"
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent class="p-0">
                <SelectGroup>
                  <SelectItem value="dni" class="px-2 py-1">DNI</SelectItem>
                  <SelectItem value="passport" class="px-2 py-1"
                    >Pasaporte</SelectItem
                  >
                  <SelectItem value="other" class="px-2 py-1">Otro</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="documentNumber">
          <FormItem class="w-1/2">
            <FormControl>
              <Input
                type="text"
                placeholder="N° Documento"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="phoneNumber">
        <FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Número de Celular"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormControl>
            <Input
              type="email"
              placeholder="Correo Electrónico"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="userType">
        <FormItem>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de usuario" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="organization">
        <FormItem>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Organización" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="org1">Organización 1</SelectItem>
                <SelectItem value="org2">Organización 2</SelectItem>
                <SelectItem value="org3">Organización 3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="userRole">
        <FormItem>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Rol de usuario" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="role1">Rol 1</SelectItem>
                <SelectItem value="role2">Rol 2</SelectItem>
                <SelectItem value="role3">Rol 3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <SheetFooter class="mt-auto">
        <Button
          :disabled="!meta.valid"
          type="submit"
          :class="
            cn(
              'w-full',
              !meta.valid
                ? 'text-primary bg-bgtheme'
                : 'hover:text-primary hover:bg-bgtheme'
            )
          "
        >
          Crear usuario
        </Button>
      </SheetFooter>
    </form>
  </SheetContent>
</template>
