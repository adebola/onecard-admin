import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {KeycloakService} from 'keycloak-angular';
import {UserService} from '../service/user.service';

export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
    roles?: string[];
}

export interface ChildrenItems {
    ab: string;
    path: string;
    title: string;
    type?: string;
}

export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        roles: []
    },
    {
        path: '/vouchers',
        title: 'Vouchers',
        type: 'sub',
        icontype: 'credit_score',
        collapse: 'vouchers',
        roles: [],
        children: [
            {path: 'cluster', title: 'Voucher Clusters', ab: 'VC'},
            {path: 'batch', title: 'Voucher Batches', ab: 'VB'},
            {path: 'voucher', title: 'Vouchers', ab: 'V'},
        ]
    },
    {
        path: '/providers',
        title: 'Providers',
        type: 'sub',
        icontype: 'business',
        collapse: 'providers',
        roles: [],
        children: [
            {path: 'provider', title: 'Providers', ab: 'P'},
            {path: 'category', title: 'Provider Categories', ab: 'PC'},
            {path: 'rechargelist', title: 'Recharge Providers', ab: 'RP'}
        ]
    },
    {
        path: '/users',
        title: 'Users',
        type: 'sub',
        icontype: 'people',
        collapse: 'users',
        roles: [],
        children: [
            {path: 'user', title: 'Users', ab: 'U'},
            {path: 'adminuser', title: 'Admin Users', ab: 'A'},
        ]

    },
    {
        path: '/organizations/organization',
        title: 'Organizations',
        type: 'link',
        icontype: 'corporate_fare',
        roles: [],
    },
    {
        path: '/kyc',
        title: 'KYC',
        type: 'sub',
        icontype: 'group_add',
        collapse: 'kyc',
        roles: ['Onecard_Admin'],
        children: [
            {path: 'settings', title: 'Settings', ab: 'S'}
        ]
    },
    {
        path: '/audit',
        title: 'Audit',
        type: 'sub',
        icontype: 'person_search',
        collapse: 'audit',
        roles: [],
        children: [
            {path: 'audit', title: 'Audit', ab: 'A'},
            {path: 'contact', title: 'Contact', ab: 'C'}
        ]
    },
    {
        path: '/failed',
        title: 'Failed Recharges',
        type: 'sub',
        icontype: 'grid_off',
        collapse: 'failed',
        roles: [],
        children: [
            {path: 'single', title: 'All Single', ab: 'A'},
            {path: 'single_unresolved', title: 'Unresolved Single', ab: 'U'},
            {path: 'bulk', title: 'All Bulk', ab: 'B'},
            {path: 'bulk_unresolved', title: 'Unresolved Bulk', ab: 'U'}
        ]
    },
    // {
    //     path: '/test/test',
    //     title: 'Test',
    //     type: 'link',
    //     icontype: 'battery_charging_full'
    // },
    {
        path: '/reports/report',
        title: 'Reports',
        type: 'link',
        icontype: 'web-stories',
        roles: [],
        // icontype: 'summarize',
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;
    public userName: string;
    public userImage = '../../../assets/img/faces/default-avatar.png';

    constructor(private userService: UserService,
                private keycloak: KeycloakService) {}

    ngOnInit() {
        this.userService.findSelf().subscribe(user => {
            this.userName = user.username;
            if (user.profilePicture) {
                this.userImage = user.profilePicture;
            }
        });

        const roles = this.keycloak.getUserRoles();
        this.menuItems = ROUTES.filter(m => {
            if (m.roles.length === 0) {
                return true;
            } else  {
                for (const el of m.roles) {
                    if (roles.includes(el)) {
                        return true;
                    }
                }
            }

            return false;
        });

        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }

    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }

        return bool;
    }

    logout() {
        this.keycloak.logout().then(o => console.log('You have been logged Out'));
    }
}

