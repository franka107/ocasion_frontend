const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/update-password']
export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession()
    
    if (!PUBLIC_ROUTES.includes(to.path) && !loggedIn.value){
        return navigateTo("/auth/login")
    } else if (PUBLIC_ROUTES.includes(to.path) && loggedIn.value) {
        return navigateTo("/backoffice/users/organizations")
    }
    return
  })