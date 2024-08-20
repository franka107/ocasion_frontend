export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig(event).public;
  const body = await readBody(event);
  try {
    const user: any = await $fetch(apiUrl + "/auth-management/login-user", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    await setUserSession(event, {
      user,
      loggedInAt: new Date(),
      // Any extra fields
    });
    return user;
  } catch (error: any) {
    throw createError({
      data: error.data,
    });
  }
});
