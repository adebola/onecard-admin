export interface Report {
    id: number;
    reportNameName: string;
    reportDescription: string;
    createdBy: string;
    createdDate: Date;
}

export interface RechargeReportRequest {
    userId: string;
    serviceCode: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
}
