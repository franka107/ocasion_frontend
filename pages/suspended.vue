<template>
  <div
    class="min-h-screen bg-background flex flex-col items-center justify-center p-4"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <XCircle class="mx-auto h-24 w-24 text-destructive" />
      <h1 class="text-4xl font-bold text-foreground">Cuenta suspendida</h1>
      <p class="text-xl text-muted-foreground">
        Lo sentimos, tu cuenta ha sido suspendida, si deseas mas información
        comunicate con tu supervisor o envia un correo a contacto@deocasion.pe
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button variant="outline" @click="handleSignOut">
          Iniciar sesión
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, RouterLink } from 'vue-router'
import { XCircle } from 'lucide-vue-next'
import { UserType } from '~/types/Administrators'
const { clear, user } = useUserSession()
const router = useRouter()
const handleSignOut = async () => {
  await clear()
  router.push('/auth/login')
  await fetch('/api/auth/logout', {
    method: 'POST',
  })
}

const handleBackClick = () => {
  const userType = user.value?.user.type
  if (!userType) return
  if (
    [
      UserType.SuperAdmin,
      UserType.PlatformUser,
      UserType.PlatformAdmin,
    ].includes(userType)
  ) {
    router.push('/dashboard/platform/graphics')
  } else {
    router.push(
      `dashboard/organization/${user.value?.user.organizations[0].id || 'not-found'}/events`,
    )
  }
}
</script>
