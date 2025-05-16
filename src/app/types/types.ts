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