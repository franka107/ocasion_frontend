<template>
  <AuthForm logo-subtitle="Acceso Admin">
    <BaseForm 
      title="Crear una nueva contraseña"
      submit-text="Continuar"
      :submit-class="submitButtonClass"
      :isActive="isActive"
      @submit="handleSubmit"
      class="relative"
    >
      <div class="mb-6 relative">
        <InputWithLabel
          id="password"
          label="Contraseña"
          :type="showPassword ? 'text': 'password'"
          v-model="password"
        >
          <template #icon-right>
            <button
              @click="togglePasswordVisibility('password')"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              <CustomIcons :name="showPassword ? 'EyeIcon': 'EyeIconClosed'" class="w-10 h-10" />
            </button>
          </template>
        </InputWithLabel>  
      </div>
    
      <div class="mb-6 relative">
        <InputWithLabel
          id="confirmPassword"
          :type="showPasswordConfirm ? 'text': 'password'"
          label="Confirmar contraseña"
          v-model="confirmPassword"
        >
          <template #icon-right>
            <button
              @click="togglePasswordVisibility('confirmPassword')"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              <CustomIcons :name="showPasswordConfirm ? 'EyeIcon': 'EyeIconClosed'" class="w-10 h-10" />
            </button>
          </template>
        </InputWithLabel>
      </div>

      <div v-if="showPasswordRequirements" class="text-custom-16 font-roboto text-gray-600 mt-4 bg-[#F8FAFC] p-4 rounded-md shadow-md mb-12">
        <p class="text-base font-roboto mb-2">Tu contraseña debe tener al menos 3 de los siguientes requisitos:</p>
        <ul class="list-none pl-5 mt-2">
          <li v-for="(req, index) in passwordRequirements" :key="index" class="flex items-center mb-2">
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
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import AuthForm from '~/components/auth/authForm.vue';
import BaseForm from '~/components/auth/baseForm.vue';
import InputWithLabel from '~/components/auth/inputWithLabel.vue';
import Dialog from '~/components/auth/dialogForm.vue';
import messageIcon from '~/assets/icon/png/check-icon.png';
import { useValidationForm } from '~/composables/useValidateForm';

const { password, validationResult } = useValidationForm();
const confirmPassword = ref('');
const isDialogOpen = ref(false);
const showPasswordRequirements = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const passwordRequirements = [
  '✓ Al menos 8 caracteres',
  '✓ Letras minúsculas (a-z)',
  '✓ Letras mayúsculas (A-Z)',
  '✓ Números (0-9)',
  '✓ Caracteres especiales (@$!%*#?&)'
];

// Activar el botón cuando se ingrese cualquier carácter en el campo de contraseña
const isActive = computed(() => password.value.length >= 8 && confirmPassword.value.length >= 1);

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
  const requirementMap = {
    '✓ Al menos 8 caracteres': password.value.length >= 8,
    '✓ Letras minúsculas (a-z)': /[a-z]/.test(password.value),
    '✓ Letras mayúsculas (A-Z)': /[A-Z]/.test(password.value),
    '✓ Números (0-9)': /[0-9]/.test(password.value),
    '✓ Caracteres especiales (@$!%*#?&)': /[@$!%*#?&]/.test(password.value),
  };

  return requirementMap[requirement] || false;
};

// Obtener la clase de un requisito basado en su estado
const getRequirementClass = (requirement: string) => {
  return isRequirementFulfilled(requirement) ? 'text-primary' : 'text-red-500';
};

// Mostrar los requisitos de la contraseña si se ha ingresado algo
watch(password, (newVal) => {
  showPasswordRequirements.value = newVal.length > 0;
});
watch(confirmPassword, (newVal) => {
  showPasswordRequirements.value = password.value.length > 0;
});

const togglePasswordVisibility = (type: 'password' | 'confirmPassword') => {
  if (type === 'password') {
    showPassword.value = !showPassword.value;
  } else if (type === 'confirmPassword') {
    showPasswordConfirm.value = !showPasswordConfirm.value;
  }
};

const messageIconSrc = messageIcon;

// Función para ir a la página de actualización de contraseña
const goToUpdatePassword = () => {
  console.log('Ir a la página de actualización de contraseña');
};
</script>
