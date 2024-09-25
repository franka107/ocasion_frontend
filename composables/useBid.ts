const BID_BASE_URL = "/bid-management";

export function useBidAPI() {
  const page = ref(1);
  const sortOptions = ref("[]");
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject);
  };
  const rejectOfferBids = async (values: {
    type: string;
    ids: string[];
    eventId: string;
  }) => {
    const { status, error }: any = await useAPI(
      `${BID_BASE_URL}/reject-offer-bids`,
      {
        method: "POST",
        body: values,
      } as any,
    );
    return { status, error };
  };

  const acceptOfferBids = async (values: {
    type: string;
    ids: string[];
    eventId: string;
  }) => {
    const { status, error }: any = await useAPI(
      `${BID_BASE_URL}/accept-offer-bids`,
      {
        method: "POST",
        body: values,
      } as any,
    );
    return { status, error };
  };

  const counterOfferBid = async (values: {
    id: string;
    counterOfferAmount: string;
  }) => {
    const { status, error }: any = await useAPI(
      `${BID_BASE_URL}/counter-offer-bid`,
      {
        method: "POST",
        body: values,
      } as any,
    );
    return { status, error };
  };

  return {
    rejectOfferBids,
    acceptOfferBids,
    page,
    sortOptions,
    onSort,
    counterOfferBid,
  };
}
