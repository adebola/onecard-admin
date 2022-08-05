export interface SearchBulkRecharge {
    userId: string;
    searchId: string;
    searchDate: string;
    pageNumber: number;
    pageSize: number;
}

export interface SearchBulkFailedRecharge {
    searchId: string;
    searchDate: string;
    unresolved: boolean;
}
