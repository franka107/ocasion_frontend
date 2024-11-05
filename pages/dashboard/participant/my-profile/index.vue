<template>
  <ContentLayout title="Mi perfil">
    <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
    <section>
      <ProfileDetails></ProfileDetails>
      <div class="w-full mt-4">
        <div
          class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px] pb-[32px] px-6"
        >
          <h1
            class="text-[20px] font-[700] leading-[28px] text-primary border-b-[1px] pb-[31.5px] border-[#E2E8F0]"
          >
            Datos del Perfil
          </h1>
          <form @submit.prevent="handleSubmit">
            <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]"
            >
              <div class="flex gap-2">
                <div class="w-1/2">
                  <label
                    for="documentType"
                    class="block text-sm font-medium mb-[6px]"
                    >Tipo de documento
                    <span class="text-[#F6313C]">*</span></label
                  >
                  <Select id="documentType" v-model="formData.documentType">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                      <SelectItem value="Carnet de extranjería"
                        >Carnet de extranjería</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </div>
                <div class="w-full">
                  <label
                    for="documentNumber"
                    class="block text-sm font-medium mb-[6px]"
                    >Documento <span class="text-[#F6313C]">*</span></label
                  >
                  <Input
                    id="documentNumber"
                    v-model="formData.documentNumber"
                    type="text"
                    placeholder="Documento"
                    class="mt-1 block w-full"
                  />
                </div>
              </div>

              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium mb-[6px]"
                  >Nombres <span class="text-[#F6313C]">*</span></label
                >
                <Input
                  id="firstName"
                  v-model="formData.firstName"
                  type="text"
                  placeholder="Nombres"
                  class="mt-1 block w-full"
                />
              </div>
              <div>
                <label
                  for="lastNameFather"
                  class="block text-sm font-medium mb-[6px]"
                  >Apellido paterno <span class="text-[#F6313C]">*</span></label
                >
                <Input
                  id="lastNameFather"
                  v-model="formData.lastNameFather"
                  type="text"
                  placeholder="Apellido paterno"
                  class="mt-1 block w-full"
                />
              </div>
              <div>
                <label
                  for="lastNameMother"
                  class="block text-sm font-medium mb-[6px]"
                  >Apellido materno <span class="text-[#F6313C]">*</span></label
                >
                <Input
                  id="lastNameMother"
                  v-model="formData.lastNameMother"
                  type="text"
                  placeholder="Apellido materno"
                  class="mt-1 block w-full"
                />
              </div>
              <div class="flex gap-2">
                <div class="w-1/2">
                  <label for="gender" class="block text-sm font-medium mb-[6px]"
                    >Sexo <span class="text-[#F6313C]">*</span></label
                  >
                  <Select id="gender" v-model="formData.gender">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="w-1/2">
                  <label
                    for="maritalStatus"
                    class="block text-sm font-medium mb-[6px]"
                    >Estado civil <span class="text-[#F6313C]">*</span></label
                  >
                  <Select id="maritalStatus" v-model="formData.maritalStatus">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soltero">Soltero</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viudo">Viudo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div class="flex items-end gap-2">
                <div class="w-1/2">
                  <label
                    for="birthDate"
                    class="block text-sm font-medium mb-[6px]"
                    >Fecha de nacimiento
                    <span class="text-[#F6313C]">*</span></label
                  >
                  <Input
                    id="birthDate"
                    v-model="formData.birthDate"
                    type="date"
                    class="mt-1 block w-full"
                  />
                </div>
                <span class="mb-[8px] text-sm text-gray-500"
                  >EDAD: {{ calculateAge(formData.birthDate) }} años</span
                >
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium mb-[6px]"
                  >Teléfono <span class="text-[#F6313C]">*</span></label
                >
                <Input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  placeholder="Número de teléfono"
                  class="mt-1 block w-full"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium mb-[6px]"
                  >Correo <span class="text-[#F6313C]">*</span></label
                >
                <Input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="ejemplo@deocasion.com"
                  class="mt-1 block w-full"
                />
              </div>
            </div>
            <!-- <div class="mt-6">
                          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                              Enviar
                          </button>
                      </div> -->
          </form>
        </div>
        <div class="w-full mt-4">
          <div
            class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px] pb-[32px] px-6"
          >
            <div
              class="flex justify-between border-b-[1px] pb-[31.5px] border-[#E2E8F0] w-full"
            >
              <h1
                class="flex items-center text-[20px] font-[700] leading-[28px] text-primary"
              >
                Cambiar contraseña
              </h1>
              <div class="h 10 w 10">
                <Button
                  class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
                  @click=""
                >
                  Cambiar
                </Button>
              </div>
            </div>
            <div
              class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]"
            >
              <div>
                <div class="flex">
                  <label for="phone" class="block text-sm font-medium mb-[6px]"
                    >Contraseña actual
                    <span class="text-[#F6313C]">*</span></label
                  >
                  <CustomIcons name="info" class="w-6 h-6" />
                </div>
                <Input
                  id="currentPassword"
                  v-model="formData.currentPassword"
                  type="text"
                  placeholder="Contraseña actual"
                  class="mt-1 block w-full"
                />
              </div>
              <div></div>
              <div>
                <div class="flex">
                  <label for="phone" class="block text-sm font-medium mb-[6px]"
                    >Nueva contraseña
                    <span class="text-[#F6313C]">*</span></label
                  >
                  <CustomIcons name="info" class="w-6 h-6" />
                </div>
                <Input
                  id="newPassword"
                  v-model="formData.newPassword"
                  type="text"
                  placeholder="Nueva contraseña"
                  class="mt-1 block w-full"
                />
              </div>
              <div>
                <div class="flex">
                  <label for="phone" class="block text-sm font-medium mb-[6px]"
                    >Confirmar contraseña
                    <span class="text-[#F6313C]">*</span></label
                  >
                  <CustomIcons name="info" class="w-6 h-6" />
                </div>
                <Input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  type="text"
                  placeholder="Confirmar contraseña"
                  class="mt-1 block w-full"
                />
              </div>
            </div>
            <NuxtLink
              to="https://web.dev.deocasion.pe/auth/register"
              rel="noopener noreferrer"
            >
              <p
                class="mt-[24px] mb-[32px] text-[#052339] text-[14px] font-[600]"
              >
                He olvidado mi contraseñe actual
              </p>
            </NuxtLink>
            <div
              class="px-6 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[10px] w-full"
            >
              <Button
                type="button"
                size="xl"
                class="text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
                @click=""
                >Cancelar</Button
              >
              <Button
                type="submit"
                class="text-[14px] md:text-[16px] font-[600]"
                size="xl"
                >Confirmar</Button
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import ProfileDetails from '@/components/purse/ProfileDetails.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
const formData = ref({
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastNameFather: '',
  lastNameMother: '',
  gender: '',
  maritalStatus: '',
  birthDate: '',
  phone: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const handleSubmit = () => {
  console.log(formData.value)
}

const calculateAge = (birthDate: string) => {
  if (!birthDate) return '00'
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age
}
</script>

