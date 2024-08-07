<script setup lang="ts">
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

const { handleSubmit } = useForm({
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

    <div class="border-primary border-[1px]"></div>

    <form class="flex flex-col gap-4 flex-grow" @submit="onSubmit">
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
        <FormField v-slot="{ componentField }" name="documentType" class="w-2/5">
          <FormItem class="w-2/5">
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="passport">Pasaporte</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="documentNumber" class="w-3/5">
          <FormItem class="w-3/5">
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
                <SelectValue placeholder="Seleccione el tipo de usuario" />
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
                <SelectValue placeholder="Seleccione la organización" />
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
                <SelectValue placeholder="Seleccione el rol de usuario" />
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
        <Button type="submit" class="w-full"> Crear usuario </Button>
      </SheetFooter>
    </form>
  </SheetContent>
</template>
