<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="relative bg-[#e8edf3] hover:bg-[#d1d7de] w-10 h-10 rounded-full"
      >
        <img src="@/assets/icon/svg/icon-user.svg" class="w-5 h-5 m-auto" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal py-2">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.user.commonName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.user.email }}
          </p>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator class="mx-2" />
      <DropdownMenuItem
        class="hover:cursor-pointer text-red-500 focus:bg-red-100 focus:text-red-500"
        @click="handleSignOut"
      >
        Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import type { User } from '#auth-utils'

const router = useRouter()
const { clear, user } = useUserSession()

const handleSignOut = async () => {
  await clear()
  await fetch('/api/auth/logout', {
    method: 'POST',
  })

  router.push('/auth/login')
}
</script>
