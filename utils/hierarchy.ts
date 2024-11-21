import { UserType } from '~/types/Administrators'

export const userTypeHierarchy: UserType[] = [
  UserType.SuperAdmin,
  UserType.PlatformAdmin,
  UserType.PlatformUser,
  UserType.OrganizationAdmin,
  UserType.OrganizationUser,
  UserType.Participant,
]

export const isHigherOrEqualUserType = (
  userType: UserType,
  comparedUserType: UserType,
): boolean => {
  return (
    userTypeHierarchy.indexOf(userType) >=
    userTypeHierarchy.indexOf(comparedUserType)
  )
}

export const isHigherUserType = (
  userType: UserType,
  comparedUserType: UserType,
): boolean => {
  return (
    userTypeHierarchy.indexOf(userType) >=
    userTypeHierarchy.indexOf(comparedUserType)
  )
}
