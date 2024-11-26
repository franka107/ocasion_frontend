import { UserType } from '~/types/Administrators'
import { GlobalType } from '~/types/Common'

export const userTypeToGlobal = (userType: UserType): GlobalType => {
  switch (userType) {
    case UserType.PlatformUser:
    case UserType.PlatformAdmin:
    case UserType.SuperAdmin:
      return GlobalType.Platform
    case UserType.OrganizationUser:
    case UserType.OrganizationAdmin:
      return GlobalType.Organization
    default:
      throw new Error('Invalid user type')
  }
}
