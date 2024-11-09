import { useAPI } from "./useAPI";

const BASE_USER_URL = "/user-management";

export function useUserParticipantAPI(){
    const editParticipant = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_USER_URL}/update-participant`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };

    const changeMyPassword = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_USER_URL}/change-my-password`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };
    

      return { editParticipant, changeMyPassword }
}

