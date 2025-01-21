<template>
  <Body
    class="antialiased duration-300 transition-colors text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950"
  >
    <Toaster />

    <div>
      <NuxtLayout>
        <NuxtRouteAnnouncer />
        <NuxtLoadingIndicator />
        <NuxtPage />
      </NuxtLayout>
    </div>
  </Body>
</template>
