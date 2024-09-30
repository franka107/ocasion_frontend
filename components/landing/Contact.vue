<template>
  <section class="flex justify-center bg-[#f0f1f4] pt-[48px] pb-[28px]">
    <div class="w-[1280px] grid sm:grid-cols-1 md:grid-cols-1 grid-cols-2 justify-center px-[80px]">
      <div class="max-w-[630px]">
        <h2 class="text-left text-[#2872A1] mt-[48px] mb-[10px] text-[18px] font-[700]">¡CONTÁCTANOS!</h2>
        <h1 class="text-left text-bluePrimary mb-[18px] text-[48px] font-[700] leading-[70px]">Estamos para <span class="text-[#F6313C]">ayudarte</span></h1>
        <p class="text-[#68686C] text-[16px]">
          Te pediremos algunos datos importantes para que un experto en soluciones te ayude de la manera más acertada.
          Tómate tu tiempo, no tardarás más de dos minutos.
        </p>
        <form @submit.prevent="submitForm" class="mt-[32px] grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="nombre" class="block text-[14px] font-[500] text-[#0F172A] ">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" placeholder="Nombres"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label for="apellidos" class="block text-sm font-medium text-gray-700">Apellidos</label>
            <input type="text" id="apellidos" v-model="apellidos" placeholder="Apellidos"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label for="correo" class="block text-sm font-medium text-gray-700">Correo corporativo</label>
            <input type="email" id="correo" v-model="correo" placeholder="ejemplo@deocasion.com"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
            <input type="tel" id="telefono" v-model="telefono" placeholder="Teléfono"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label for="empresa" class="block text-sm font-medium text-gray-700">Empresa</label>
            <input type="text" id="empresa" v-model="empresa" placeholder="Empresa"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label for="puesto" class="block text-sm font-medium text-gray-700">Puesto en la empresa</label>
            <input type="text" id="puesto" v-model="puesto" placeholder="Puesto"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div class="md:col-span-2">
            <label for="mensaje" class="block text-sm font-medium text-gray-700">Mensaje</label>
            <textarea id="mensaje" v-model="mensaje" placeholder="Mensaje" rows="4"
              class="mt-1.5 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div class="md:col-span-2 flex">
            <Button type="submit" class="text-[16px] font-inter font-[600] font-[600] mt-[16px]">
              Enviar datos
            </Button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const nombre = ref('');
const apellidos = ref('');
const correo = ref('');
const telefono = ref('');
const empresa = ref('');
const puesto = ref('');
const mensaje = ref('');
const submitForm = () => {
  const formData = {
    nombre: nombre.value,
    apellidos: apellidos.value,
    correo: correo.value,
    telefono: telefono.value,
    empresa: empresa.value,
    puesto: puesto.value,
    mensaje: mensaje.value
  };
  console.log("Formulario enviado:", formData);
};
</script>