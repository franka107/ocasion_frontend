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

    <DropdownMenuContent class="w-56" align="end" >
      <!-- <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">John Doe</p>
          <p class="text-xs leading-none text-muted-foreground">
            johndoe@example.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator /> -->
      <!-- <DropdownMenuGroup>
        <DropdownMenuItem class="hover:cursor-pointer">
          <RouterLink to="/backoffice" class="flex items-center">
            <LayoutGrid class="w-4 h-4 mr-3 text-muted-foreground" />
            Dashboard
          </RouterLink>
        </DropdownMenuItem>
        <DropdownMenuItem class="hover:cursor-pointer">
          <RouterLink to="/account" class="flex items-center">
            <User class="w-4 h-4 mr-3 text-muted-foreground" />
            Account
          </RouterLink>
        </DropdownMenuItem>
      </DropdownMenuGroup> -->
      <!-- <DropdownMenuSeparator /> -->
      <DropdownMenuItem class="hover:cursor-pointer" @click="handleSignOut">
        <LogOut class="w-4 h-4 mr-3 text-muted-foreground" />
				Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";

const router = useRouter();
const { clear } = useUserSession();

const handleSignOut = async () => {
	  console.log("handleLogout");
  await clear();
  router.push("/auth/login");
};
</script>
