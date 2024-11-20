import { GlobalType } from '~/types/Common'

export function useUserSessionExtended() {
  const userSession = useUserSession()
  // code here
  const globalType = userSession.user.value
    ? userTypeToGlobal(userSession.user.value?.user.type)
    : GlobalType.Organization

  return { globalType, ...userSession }
}
