export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig(event).public
  const body = await readBody(event)
  try {
    await setUserSession(event, {
      user: body,
      loggedInAt: new Date(),
      // Any extra fields
    })
    return body
  } catch (error: any) {
    throw createError({
      data: error.data,
    })
  }
})
