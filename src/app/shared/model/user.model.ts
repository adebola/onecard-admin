import {Account} from './account.model';

export interface User {
    id: string;
    createdDate: string;
    username: string;
    enabled: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    requiredActions: string[];
    account: Account;
}
