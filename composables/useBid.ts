
const BID_BASE_URL = "/bid-management";


export function useBidAPI() {

    const rejectOfferBids = async (values: { type: string; ids: string[] }) => {
        const { status, error }: any = await useAPI(
          `${BID_BASE_URL}/reject-offer-bids`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }

    const acceptOfferBids = async (values: { type: string; ids: string[] }) => {
        const { status, error }: any = await useAPI(
          `${BID_BASE_URL}/accept-offer-bids`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }

    return{ rejectOfferBids, acceptOfferBids }

}