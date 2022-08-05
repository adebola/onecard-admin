import {Account} from './account.model';

export interface Organization {
    id: string;
    organizationName: string;
    createdBy: string;
    createdDate: string;
    account: Account;
}
