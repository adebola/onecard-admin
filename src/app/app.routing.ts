import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import {AuthGuard} from './auth/app.guard';

export const AppRoutes: Routes = [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '',
      component: AdminLayoutComponent,
      children: [
          {
              path: '',
              loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]
          },
          {
              path: 'vouchers',
              loadChildren: () => import('./vouchers/voucher.module').then(m => m.VoucherModule), canActivate: [AuthGuard]
          },
          {
              path: 'providers',
              loadChildren: () => import('./providers/provider.module').then(m => m.ProviderModule), canActivate: [AuthGuard]
          },
          {
              path: 'users',
              loadChildren: () => import('./users/user.module').then(m => m.UserModule), canActivate: [AuthGuard]
          },
          {
              path: 'audit',
              loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule), canActivate: [AuthGuard]
          },
          {
              path: 'reports',
              loadChildren: () => import('./reports/report.module').then(m => m.ReportModule), canActivate: [AuthGuard]
          },
          {
              path: 'tasks',
              loadChildren: () => import('./tasks/tasks.module').then(m => m.TaskModule), canActivate: [AuthGuard]
          }
      ]
    },
    {
      path: '',
      component: AuthLayoutComponent,
      children: [{
        path: 'profiles',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard]
      }]
    }
];
