export interface SearchSingleRecharge {
    userId: string;
    rechargeId: string;
    startDate: string;
    endDate: string;
    recipient: string;
    product: string;
    failed: boolean;
}

export interface SearchSingleFailedRecharge {
    searchDate: string;
    searchRecipient: string;
    searchProduct: string;
    unresolved: boolean;
}
