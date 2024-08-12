<template>
     <div class="flex py-4 px-10 rounded-xl min-h-[88px] items-center bg-white w-full mb-6">
        <div class="h 10 w 10">
            <Button variant="ghost" @click="router.back">
                <CustomIcons name="BackArrow" class="w-6 h-6 text-primary" />
            </Button>
        </div>
        <div class="ml-7">
            <p class="text-xs text-[#49454F]">Pacifico SA</p>
            <h1 class="m text- font-bold text-primary">Evento - {{ params.eventId }}</h1>
        </div>
    </div>
    <div class="py-4 px-10 rounded-xl items-center bg-white w-full">
        <div class="grid grid-cols-[2fr_1fr] gap-6">
            <div>
                <h3 class="mb-5 text-sm text-[#676767]">Datos del evento</h3>
                <div class="grid grid-cols-[repeat(auto-fill,_minmax(240px,1fr))] md:grid-cols-2 gap-5">
                    <InputWithLabel readField label="Nombre del evento" modelValue="Lote 1: vehículos seminuevos" />
                    <InputWithLabel readField label="Tipo de Evento" modelValue="Subasta" />
                    <div class="grid grid-cols-[repeat(auto-fill,_minmax(120px,1fr))] md:grid-cols-2 gap-5">
                        <InputWithLabel readField label="Fecha de Inicio" modelValue="05/08/2024" />
                        <InputWithLabel readField label="Fecha de cierre" modelValue="15/08/2024" />
                    </div>
                    <InputWithLabel readField label="Tipo de bien" modelValue="Vehicular" />
                    <InputWithLabel readField label="Horario de cierre" modelValue="08:00 a.m." />
                </div>
            </div>
            <div>
                <h3 class="mb-5 text-sm text-[#676767]">Archivos subidos</h3>
                <FormField name="attachedFiles">
                    <FormItem>
                    <FormControl>
                        <InputFile
                        hideRemoveIcon
                        v-model="attachedFiles"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                </FormField>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import InputWithLabel from '~/components/auth/inputWithLabel.vue';
import InputFile from "@/components/common/file/Input.vue";

const { params } = useRoute()
const router = useRouter()

const attachedFiles = [ 
{id: "5404523e-bb7d-4927-8fd7-512ff7eb09fb", path: "asda/asdad.svg"},  
{id: "5404523e-bb7d-4927-8fd7-512ff7eb09fb", path: "asda/asdad.svg"}
]
</script>