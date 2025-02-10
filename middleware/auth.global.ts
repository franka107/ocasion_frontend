const PUBLIC_ROUTES = [
  '/auth/test',
  '/auth/login',
  '/auth/sign-in',
  '/auth/validate-otp',
  '/auth/register',
  '/auth/update-password',
]
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()

  if (!PUBLIC_ROUTES.includes(to.path) && !loggedIn.value) {
    return navigateTo('/auth/login')
  } else if (PUBLIC_ROUTES.includes(to.path) && loggedIn.value) {
    return navigateTo('/dashboard/platform/events')
  }
})
