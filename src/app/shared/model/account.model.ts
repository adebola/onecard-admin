export interface Account {
    id: string;
    name: string;
    userId: string;
    balance: number;
    createdDate: string;
    kycVerified: boolean;
    dailyLimit: number;
}

export interface Transaction {
    id: string;
    accountId: string;
    counterpartyName: string;
    serviceName: string;
    txDate: string;
    txAmount: number;
    txNarrative: string;
    txStatus: string;
}
