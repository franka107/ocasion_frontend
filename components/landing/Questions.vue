<template>
  <section class="w-full flex justify-center px-[16px]">
    <div class="max-w-[1280px] w-full">
      <h2 class="text-center text-bluePrimary mt-[48px] mb-[16px] text-[18px] font-[700]">DUDAS</h2>
      <h1 class="text-center text-bluePrimary mb-[32px] text-[48px] font-[700]">Preguntas <span
          class="text-[#F6313C]">frecuentes</span></h1>
      <div class="max-w-[1440px] grid grid-cols-1 gap-4 mt-[32px] mb-[48px] mx-[80px]">
        <div v-for="(questions, index) in questions" :key="index" class="max-w-[1280px] border-b-[1px] border-b-[#E2E8F0] p-4 cursor-pointer">
          <div class="flex text-[16px] font-[700] justify-between items-center" @click="toggle(index)">
            <h3 class="text-[#152A3C] hover:text-[#2872A1]">{{ questions.question }}</h3>
            <button>
              <span :class="{ 'rotate-180': activeIndex === index }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#152A3C" stroke-width="1.33333" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </span>
            </button>
          </div>
          <p v-if="activeIndex === index" class="mt-2 text-[#0F172A] text-[14px] font-[400s] transition-all">
            {{ questions.answer }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

interface FAQ {
  question: string;
  answer: string;
}

const questions = ref<FAQ[]>([
  {
    question: "1. ¿QUÉ SIGNIFICA UNA SUBASTA ONLINE?",
    answer:
      "Lorem ipsum dolor sit amet consectetur. Tincidunt vestibulum consectetur nisl nec sit amet sociis. Enim turpis non varius dignissim quis metus. Scelerisque faucibus tincidunt enim nisi sit aliquet.",
  },
  {
    question: "2. ¿CÓMO REALIZO UNA RECARGA DE SALDO?",
    answer:
      "Lorem ipsum dolor sit amet consectetur. Pulvinar pellentesque fermentum arcu pellentesque vel aliquam suspendisse metus egestas.",
  },
  {
    question: "3. ¿CÓMO PARTICIPO DE UNA SUBASTA?",
    answer:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  {
    question: "4. ¿TIENE ALGÚN COSTO INSCRIBIRME EN LA PLATAFORMA?",
    answer:
      "Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Amet volutpat consequat mauris nunc congue.",
  },
  {
    question: "5. ¿QUÉ ES EL CÓDIGO DE USUARIO?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Pulvinar etiam non quam lacus suspendisse.",
  },
  {
    question: "6. ¿LOS IMPORTES DE LAS SUBASTAS INCLUYEN IGV?",
    answer:
      "Faucibus scelerisque eleifend donec pretium vulputate sapien nec. Phasellus vestibulum lorem sed risus ultricies tristique.",
  },
]);

const activeIndex = ref<number | null>(null);

const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>