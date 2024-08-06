const PUBLIC_ROUTES = ['/auth/login', '/auth/register']
export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession()
    
    if (!PUBLIC_ROUTES.includes(to.path) && !loggedIn.value){
        return navigateTo("/auth/login")
    } else if (PUBLIC_ROUTES.includes(to.path) && loggedIn.value) {
        return navigateTo("/dashboard")
    }
    return
  })