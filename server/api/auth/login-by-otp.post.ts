export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig(event).public
  const body = await readBody(event)
  try {
    await setUserSession(event, {
      user: body,
      loggedInAt: new Date(),
      // Any extra fields
    })

    setCookie(event, 'isLoggedIn', JSON.stringify(true), {
      domain: '.localhost',
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
    })
    return body
  } catch (error: any) {
    throw createError({
      data: error.data,
    })
  }
})
