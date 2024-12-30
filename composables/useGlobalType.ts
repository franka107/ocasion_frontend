import { GlobalType } from '~/types/Common'

export function useUserSessionExtended() {
  const userSession = useUserSession()
  if (!userSession.user.value) {
    throw new Error('User not found')
  }
  const user = userSession.user.value.user
  // code here
  const globalType = userTypeToGlobal(user.type)

  const getDefaultOrganization = () => {
    if (globalType === GlobalType.Organization) {
      return user.organizations[0]
    }
    throw new Error('User type is not an organization')
  }

  return { globalType, user, getDefaultOrganization }
}
