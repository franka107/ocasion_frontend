<template>
  <NuxtLayout logo-subtitle="Acceso Admin">
    <BaseForm 
      title="Crear una nueva contraseña"
      submit-text="Continuar"
      :submit-class="submitButtonClass"
      :disabled="!isActive"
      @submit="handleSubmit"
      class="relative"
    >
      <div class="mb-6 relative">
        <InputWithLabel
          id="password"
          type="password"
          label="Contraseña"
          v-model="password"
        />
      </div>
      <div class="mb-6 relative">
        <InputWithLabel
          id="confirmPassword"
          type="password"
          label="Confirmar contraseña"
          v-model="confirmPassword"
        />
      </div>
      <div v-if="showPasswordRequirements" class="text-custom-16 font-roboto text-gray-600 mt-4 bg-[#F8FAFC] p-4 rounded-md shadow-md mb-12">
        <p class="text-base font-roboto mb-2">Tu contraseña debe tener al menos 3 de los siguientes requisitos:</p>
        <ul class="list-none pl-5 mt-2">
          <li v-for="(req, index) in passwordRequirements" :key="index" class="flex items-center mb-2">
            <img 
              v-if="isRequirementFulfilled(req)"
              :src="messageIconSrc" 
              alt="Ícono de verificación" 
              class="h-4 w-4 text-green-500 mr-2" 
            />
            <span :class="getRequirementClass(req)">{{ req }}</span>
          </li>
        </ul>
      </div>
    </BaseForm>
    <Dialog 
      v-model:open="isDialogOpen"
      :iconSrc="messageIconSrc"
      iconAlt="Icono de alerta"
      title="Contraseña creada"
      description="La contraseña se ha creado correctamente."
      subDescription="Por favor inicie sesión"
      buttonText="Aceptar"
      iconBgColor="bg-[#00BB8E]"
      @close="closeDialog"
      @action="goToUpdatePassword"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import NuxtLayout from '~/components/auth/authForm.vue';
import BaseForm from '~/components/auth/baseForm.vue';
import InputWithLabel from '~/components/auth/inputWithLabel.vue';
import Dialog from '~/components/auth/dialogForm.vue';
import messageIcon from '~/assets/icon/png/check-icon.png';
import { useValidationForm } from '~/composables/useValidateForm';

const { password, validationResult } = useValidationForm();
const confirmPassword = ref('');
const isDialogOpen = ref(false);
const showPasswordRequirements = ref(false);

const passwordRequirements = [
  'Al menos 8 caracteres',
  'Letras minúsculas (a-z)',
  'Letras mayúsculas (A-Z)',
  'Números (0-9)',
  'Caracteres especiales (@$!%*#?&)'
];

// Activar el botón cuando se ingrese cualquier carácter en el campo de contraseña
const isActive = computed(() => password.value.length > 0);

// Clase del botón de envío
const submitButtonClass = computed(() => {
  return isActive.value
    ? 'w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary'
    : 'w-full py-2 mt-4 bg-gray-200 text-gray-400 rounded cursor-not-allowed';
});

// Manejar el envío del formulario
const handleSubmit = () => {
  if (isActive.value && validationResult.value.valid && password.value === confirmPassword.value) {
    console.log('Enviar formulario de contraseña');
    isDialogOpen.value = true;
  } else {
    console.log('La contraseña no cumple con los requisitos o no coincide con la confirmación');
  }
};

// Cerrar el diálogo
const closeDialog = () => {
  isDialogOpen.value = false;
};

// Verificar si un requisito está cumplido
const isRequirementFulfilled = (requirement: string) => {
  return !validationResult.value.errors.includes(requirement);
};

// Obtener la clase de un requisito basado en su estado
const getRequirementClass = (requirement: string) => {
  return isRequirementFulfilled(requirement) ? 'text-primary' : 'text-red-500';
};

// Mostrar los requisitos de la contraseña si se ha ingresado algo
watch(password, (newVal) => {
  showPasswordRequirements.value = newVal.length > 0;
});

const messageIconSrc = messageIcon;

// Función para ir a la página de actualización de contraseña
const goToUpdatePassword = () => {
  console.log('Ir a la página de actualización de contraseña');
};
</script>