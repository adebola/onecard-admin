export interface SearchSingleRecharge {
    userId: string;
    searchDate: string;
    searchRecipient: string;
    searchProduct: string;
    pageNumber: number;
    pageSize: number;
}

export interface SearchSingleFailedRecharge {
    searchDate: string;
    searchRecipient: string;
    searchProduct: string;
    unresolved: boolean;
}
