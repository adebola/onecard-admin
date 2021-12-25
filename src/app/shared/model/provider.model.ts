export interface Provider {
    id: number;
    category: string;
    name: string;
    code: string;
    activated: boolean;
    activatedBy: string;
    status: string;
    createdBy: string;
    createdDate: string;
    activationDate: string;
    suspended: boolean;
}

export interface ProviderCategory {
    id: number;
    categoryName: string;
    createdDate: string;
    createdBy: string;
}

export interface ServiceAction {
    id: number;
    serviceName: string;
    serviceCode: string;
    serviceCost: number;
    providerCode: string;
    providerName: string;
    createdBy: string;
    createdDate: string;
    activated: boolean;
    activatedBy: string;
    activationDate: string;
    actionName: string;
    suspended: boolean;
}

export interface Action {
    id: number;
    action: string;
    fixedPrice: boolean;
}

export interface RechargeProvider {
    id: number;
    name: string;
    code: string;
    walletId: string;
    createdBy: string;
    createdDate: string;
    activated: boolean;
    activatedBy: string;
    activationDate: string;
    suspended: boolean;
}
