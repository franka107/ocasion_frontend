export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig(event).public
  const body = await readBody(event)
  try {
    const user: any = await $fetch(
      apiUrl + '/auth-management/reset-user-password',
      {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      },
    )
    return user
  } catch (error: any) {
    console.log(error)
    throw createError({
      data: error.data,
    })
  }
})
