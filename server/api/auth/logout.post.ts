export default defineEventHandler(async (event) => {
  const { apiUrl, globalDomain } = useRuntimeConfig(event).public
  try {
    setCookie(event, 'isLoggedIn', JSON.stringify(false), {
      domain: globalDomain,
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
    })
  } catch (error: any) {
    throw createError({
      data: error.data,
    })
  }
})
