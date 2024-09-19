import { useAPI } from "./useAPI";

const BASE_PAY_URL = "/payment-management";

export function usePaymentAPI(){
    const page = ref(1);
    const sortOptions = ref("[]");
    const onSort = (sortObject: { [key: string]: string }[]) => {
        sortOptions.value = JSON.stringify(sortObject);
      };
    const observePayment = async (values: {paymentId: string , reason: string}) => {
        const { status, error }: any = await useAPI(
          `${BASE_PAY_URL}/observe-payment`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };

    const confirmPayment = async (values: { paymentId: string }) => {
        const { status, error }: any = await useAPI(
          `${BASE_PAY_URL}/confirm-payment`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };
    

      return { confirmPayment, observePayment, sortOptions, page, onSort }
}

