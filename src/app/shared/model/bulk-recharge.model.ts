
export interface IndividualRequests {
    id: number;
    serviceCode: string;
    serviceCost: number;
    recipient: string;
    refundId: string;
    resolveId: string;
    retryId: string;
    failed: boolean;
    failed_message: string;
}
export interface BulkRecharge {
    id: string;
    totalServiceCost: number;
    createdAt: string;
}
