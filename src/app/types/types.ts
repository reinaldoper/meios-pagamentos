export  interface UserType {
    uid: string;
    createdAt: Date;
    email: string;
    role: string;
  }

  export interface Wallet {
    balance: number;
    uid?: string;
  }

  export interface PaymentRequest {
    id: string;
    amount: number;
    description: string;
    status: string;
    createdAt: { seconds: number };
  }