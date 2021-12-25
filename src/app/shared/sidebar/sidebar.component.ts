import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {KeycloakService} from 'keycloak-angular';

export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard'
    },
    // {
    //     path: '/tasks/task',
    //     title: 'Tasks',
    //     type: 'link',
    //     icontype: 'tasks'
    // },
    {
        path: '/vouchers',
        title: 'Vouchers',
        type: 'sub',
        icontype: 'credit_score',
        collapse: 'vouchers',
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
        children: [
            {path: 'provider', title: 'Providers', ab: 'P'},
            {path: 'category', title: 'Provider Categories', ab: 'PC'}
        ]
    },
    // {
    //     path: '/agents',
    //     title: 'Agents',
    //     type: 'link',
    //     icontype: 'contacts'
    // },
    {
        path: '/users/user',
        title: 'Users',
        type: 'link',
        icontype: 'people'
    },
    // {
    //     path: '/pages/page',
    //     title: 'Pages',
    //     type: 'link',
    //     icontype: 'pages'
    // },
    // {
    //     path: '/blogs/blog',
    //     title: 'Blogs',
    //     type: 'link',
    //     icontype: 'post_add'
    // },
    // {
    //     path: '/recharges/recharge',
    //     title: 'Recharge',
    //     type: 'link',
    //     icontype: 'battery_charging_full'
    // },
    {
        path: '/audit/audit',
        title: 'Audit',
        type: 'link',
        icontype: 'person_search'
    },
    {
        path: '/reports/report',
        title: 'Reports',
        type: 'link',
        icontype: 'summarize',
    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;

    constructor(protected readonly keycloak: KeycloakService) {}

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
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
