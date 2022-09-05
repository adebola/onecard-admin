export interface RechargeProvider {
    id: number;
    name: string;
    code: string;
    balance: number;
    activated: boolean;
    activatedBy: string;
    activationDate: string;
    createdBy: string;
    createdDate: string;
    suspended: boolean;
    weight: number;
}
