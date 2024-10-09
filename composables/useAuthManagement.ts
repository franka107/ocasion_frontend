import type { GrantId } from "~/types/Grant";

const AUTH_MANAGEMENT_BASE_URL = "/auth-management";

export function useAuthManagement() {
  const getMyGrants = async () => {
    const { status, error, data, refresh } = await useAPI<GrantId[]>(
      `${AUTH_MANAGEMENT_BASE_URL}/get-my-grants`,
      {
        method: "GET",
      } as any,
      true,
    );
    const emptyGrants = ref([]);
    return { status, error, data: data.value ? data : emptyGrants, refresh };
  };

  return { getMyGrants };
}
