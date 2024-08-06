export default defineEventHandler(async (event) => {
    const { apiUrl } = useRuntimeConfig(event)
    const body = await readBody(event)
    try {
        const user: any = await $fetch(apiUrl + '/auth/email/login',{
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        })
        await setUserSession(event, {
            user,
            loggedInAt: new Date()
            // Any extra fields
          })
        return user
        
    } catch (error) {
        console.error("error 2", error);
        return error
    }
})
  