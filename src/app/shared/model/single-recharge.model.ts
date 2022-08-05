export interface SingleRecharge {
    id: string;
    retryId: string;
    failed: boolean;
    refundId: string;
    createdAt: string;
    resolveId: string;
    recipient: string;
    serviceCost: number;
    serviceCode: string;
}
