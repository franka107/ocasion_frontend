<template>
  <div class="max-w-[1280px] mx-[80px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mt-[32px] mb-[48px] mx-[30px]">
    <div v-for="(card, index) in cards" :key="index" class="bg-white rounded-lg shadow-lg p-4 max-w-[305px]">
      <div class="flex justify-center w-[179px] rounded-[8px] bg-[#E6F0F8]">
        <CustomIcons name="calendar-today" class="" />
        <h3 class="font-[600] text-[#152A3C] text-[12px] leading-[26px] ml-[6px]">Cierre: {{ card.fechaCierre }}</h3>
      </div>
      <div class="flex h-[56px] mt-[12px] mb-[12px]">
        <img src="/assets/img/logo-ocasion.png" alt="ocasion">
        <p class="text-[18px] md:text-[15px] lg:text-[17px] xl:text-[18px] font-[600] text-[#152A3C] ml-[8px]">{{ card.titulo }}</p>
      </div>
      <p class="h-[56px] text-[#86868A] text-[18px] font-[500]">{{ card.descripcion }}</p>
      <div class="flex justify-end">
        <button
          class="mt-[12px] px-4 py-2 text-[14px] text-[#388EBF] font-[500] hover:text-white hover:bg-bluePrimary hover:rounded-[8px]">
          Ver detalle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Card {
  fechaCierre: string;
  titulo: string;
  organizacion: string;
  descripcion: string;
}

const cards = ref<Card[]>([
  {
    fechaCierre: "16 Set, 2024 12:45",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización A",
    descripcion: "Maquinaria de Construcción y/o Agrícola",
  },
  {
    fechaCierre: "17 Set, 2024 13:00",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización B",
    descripcion: "Equipo pesado para construcción",
  },
  {
    fechaCierre: "18 Set, 2024 10:30",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización C",
    descripcion: "Tractores y herramientas agrícolas",
  },
  {
    fechaCierre: "19 Set, 2024 15:15",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización D",
    descripcion: "Excavadoras y maquinaria pesada",
  },
  {
    fechaCierre: "20 Set, 2024 09:00",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización E",
    descripcion: "Equipos para minería",
  },
  {
    fechaCierre: "21 Set, 2024 11:45",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización F",
    descripcion: "Maquinaria agrícola avanzada",
  },
  {
    fechaCierre: "22 Set, 2024 14:30",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización G",
    descripcion: "Camiones y equipo de transporte",
  },
  {
    fechaCierre: "23 Set, 2024 16:00",
    titulo: "Lorem ipsum dolor sit amet consectetur.",
    organizacion: "Organización H",
    descripcion: "Maquinaria de construcción y agrícola",
  }
]);
</script>