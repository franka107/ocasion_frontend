import type { GrantId } from "~/types/Grant";

const AUTH_MANAGEMENT_BASE_URL = "/auth-management";

export function useAuthManagement() {
  const getMyGrants = async () => {
    const { status, error, data, refresh } = await useAPI<GrantId[]>(
      `${AUTH_MANAGEMENT_BASE_URL}/get-my-grants`,
      {
        method: "GET",
      } as any,
    );
    return { status, error, data, refresh };
  };

  return { getMyGrants };
}
