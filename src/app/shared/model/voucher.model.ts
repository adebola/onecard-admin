export interface Batch {
    id: string;
    clusterId: string;
    createdDate: string;
    createdBy: string;
    denomination: number;
    voucherCount: number;
    activated: boolean;
    activationDate: string;
    activatedBy: string;
    expiryDate: string;
    suspended: boolean;
}

export interface Voucher {
    id: number;
    code: string;
    serialNumber: string;
    denomination: number;
    createdDate: string;
    createdBy: string;
    batchId: number;
    expiryDate: string;
    activated: boolean;
    activationDate: string;
    activatedBy: string;
    suspended: boolean;
}

export interface Cluster {
    id: string;
    name: string;
    amount: number;
    balance: number;
    activated: boolean;
    activationDate: string;
    activatedBy: string;
    description: string;
    createdBy: string;
    createdDate: string;
    suspended: boolean;
}
