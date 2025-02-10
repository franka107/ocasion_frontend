import { routesV1 } from '~/src/infraestructure/network/constants/backend-routes'
import { httpClient } from '~/src/infraestructure/network/utils/http-client'

export const useRetireRequestService = () => {
  const fetchPaginatedRetireRequest = async () => {
    return await httpClient<RetireRe>(
      routesV1.finance.withdrawalManagement.viewPaginatedWithdrawalRequests,
    )
  }

  //   const fetchUserById = async (id: number) => {
  //     return await httpClient(`/users/${id}`)
  //   }

  //   const createUser = async (user: Partial<User>) => {
  //     return await httpClient('/users', {
  //       method: 'POST',
  //       body: user,
  //     })
  //   }

  //   const updateUser = async (id: number, user: Partial<User>) => {
  //     return await httpClient(`/users/${id}`, {
  //       method: 'PATCH',
  //       body: user,
  //     })
  //   }

  //   const deleteUser = async (id: number) => {
  //     return await httpClient(`/users/${id}`, {
  //       method: 'DELETE',
  //     })
  //   }

  return { fetchPaginatedRetireRequest }
  //   return { fetchUsers, fetchUserById, createUser, updateUser, deleteUser }
}
