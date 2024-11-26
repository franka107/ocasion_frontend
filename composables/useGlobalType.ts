import { GlobalType } from '~/types/Common'

export function useUserSessionExtended() {
  const userSession = useUserSession()
  if (!userSession.user.value) {
    throw new Error('User not found')
  }
  const user = userSession.user.value.user
  // code here
  const globalType = userSession.user.value
    ? userTypeToGlobal(userSession.user.value?.user.type)
    : GlobalType.Organization

  return { globalType, user }
}
