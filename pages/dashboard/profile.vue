<template>
    <ContentLayout title="Mi perfil">
        <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
        <section>
            <ProfileDetails></ProfileDetails>
            <div class="w-full mt-4 ">
                <div
                    class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px] pb-[32px] px-6 ">
                    <h1
                        class=" text-[20px] font-[700] leading-[28px] text-primary border-b-[1px] pb-[31.5px] border-[#E2E8F0]">
                        Datos del Perfil</h1>
                    <form @submit.prevent="handleSubmit">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]">
                            <div>
                                <label for="documentType" class="block text-sm font-medium text-gray-700 mb-[6px]">Tipo
                                    de
                                    documento <span class="text-[#F6313C]">*</span></label>
                                <Select v-model="formData.documentType" id="documentType">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DNI">DNI</SelectItem>
                                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                        <SelectItem value="Carnet de extranjería">Carnet de extranjería</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div>
                                <label for="documentNumber" class="block text-sm font-medium text-gray-700 mb-[6px]">Documento
                                    <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.documentNumber" id="documentNumber" type="text"
                                    placeholder="Número de documento" class="mt-1 block w-full" />
                            </div>

                            <div>
                                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-[6px]">Nombres
                                    <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.firstName" id="firstName" type="text" placeholder="Nombres"
                                    class="mt-1 block w-full" />
                            </div>
                            <div>
                                <label for="lastNameFather"
                                    class="block text-sm font-medium text-gray-700 mb-[6px]">Apellido
                                    paterno <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.lastNameFather" id="lastNameFather" type="text"
                                    placeholder="Apellido paterno" class="mt-1 block w-full" />
                            </div>
                            <div>
                                <label for="lastNameMother"
                                    class="block text-sm font-medium text-gray-700 mb-[6px]">Apellido
                                    materno <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.lastNameMother" id="lastNameMother" type="text"
                                    placeholder="Apellido materno" class="mt-1 block w-full" />
                            </div>
                            <div>
                                <label for="gender" class="block text-sm font-medium text-gray-700 mb-[6px]">Sexo <span
                                        class="text-[#F6313C]">*</span></label>
                                <Select v-model="formData.gender" id="gender">
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
                            <div>
                                <label for="maritalStatus"
                                    class="block text-sm font-medium text-gray-700 mb-[6px]">Estado civil
                                    <span class="text-[#F6313C]">*</span></label>
                                <Select v-model="formData.maritalStatus" id="maritalStatus">
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
                            <div>
                                <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-[6px]">Fecha de
                                    nacimiento <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.birthDate" id="birthDate" type="date"
                                    class="mt-1 block w-full" />
                                <span class="text-sm text-gray-500">EDAD: {{ calculateAge(formData.birthDate) }}
                                    años</span>
                            </div>
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-[6px]">Teléfono
                                    <span class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.phone" id="phone" type="tel" placeholder="Número de teléfono"
                                    class="mt-1 block w-full" />
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-[6px]">Correo <span
                                        class="text-[#F6313C]">*</span></label>
                                <Input v-model="formData.email" id="email" type="email"
                                    placeholder="ejemplo@deocasion.com" class="mt-1 block w-full" />
                            </div>
                        </div>
                        <!-- <div class="mt-6">
                            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Enviar
                            </button>
                        </div> -->
                    </form>
                </div>
            </div>
        </section>
    </ContentLayout>
</template>

<script setup lang="ts">
import ProfileDetails from "@/components/purse/ProfileDetails.vue";
import ContentLayout from "~/layouts/default/ContentLayout.vue";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
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
});

const handleSubmit = () => {
    console.log(formData.value);
};

const calculateAge = (birthDate: string) => {
    if (!birthDate) return '00';
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
};
</script>