export interface OfferWithBidDto {
    id: string
    title: string
    appraisal: number
    bid:{
        createdAt: string // Iso Format
        amount: number;
        status: bidStatus[]
    };
};
    
export enum bidStatus {
    Base = 'BASE', // Base
    GivenUp = 'GIVEN_UP', // Desistida
    Winner = 'WINNER', // Ganadora
    Discarded = 'DISCARDED', // Descartada
  }
    