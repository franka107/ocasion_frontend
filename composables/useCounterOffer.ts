import type { UserDto } from '~/types/Administrators'
import type { BidDto } from '~/types/Bids'
import type { OfferDto } from '~/types/Offer'

export enum BidCounterOfferStatus {
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export type CounterOfferDto = {
  id: string
  participant: UserDto
  bid: BidDto
  offer: OfferDto
  amount: number
  status: BidCounterOfferStatus
  createdAt: Date
}

export const useCounterOffer = () => {
  const viewDetail = async (id: string) => {
    const request = await useAPI<CounterOfferDto>(
      `bid-management/counteroffer-management`,
      {
        method: 'GET',
        params: {
          id,
        },
      } as any,
    )
    return request
  }

  const acceptToParticipant = async (id: string) => {
    const request = await useAPI(
      `bid-management/counteroffer-management/accept`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return request
  }

  const rejectToParticipant = async (id: string) => {
    const request = await useAPI(
      `bid-management/counteroffer-management/reject`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return request
  }

  return {
    viewDetail,
    acceptToParticipant,
    rejectToParticipant,
  }
}
