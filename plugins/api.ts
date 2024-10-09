import { callWithNuxt } from "#app";
import { BackendErrors } from "~/constants/backend-errors";

export default defineNuxtPlugin((nuxtApp) => {
  const { apiUrl } = useRuntimeConfig().public;
  const { session, user, clear } = useUserSession();

  const api = $fetch.create({
    baseURL: String(apiUrl),
    onRequest({ request, options, error }) {
      console.log(`onRequest `);
      if (user.value?.token) {
        const headers = (options.headers ||= {});
        if (Array.isArray(headers)) {
          headers.push(["Authorization", `Bearer ${user.value?.token}`]);
        } else if (headers instanceof Headers) {
          headers.set("Authorization", `Bearer ${user.value?.token}`);
        } else {
          headers.Authorization = `Bearer ${user.value?.token}`;
        }
      }
    },
    async onResponseError({ response }) {
      console.log("onResponseError");
      const responseJson = response._data;
      const code = responseJson?.errors?.[0]?.code;
      console.log(`code ${code}`);

      if (
        [
          BackendErrors.SharedKernelSessionExpired,
          BackendErrors.UserManagementUserNotFound,
        ].includes(code)
      ) {
        await nuxtApp.runWithContext(async () => {
          await $fetch("/api/_auth/session", { method: "DELETE" });
          session.value = {} as any;
        });
      }
      if ([BackendErrors.SharedKernelNotAuthorized].includes(code)) {
        await nuxtApp.runWithContext(async () => {
          navigateTo("/not-authorized");
        });
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
