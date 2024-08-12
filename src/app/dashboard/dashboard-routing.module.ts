import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { LhoManagementComponent } from './lho-management/lho-management.component';
import { BillManagementComponent } from './bill-management/bill-management.component';
import { adminGuard } from '../guards/admin.guard';
import { AddPaymentDetailsComponent } from './add-payment-details/add-payment-details.component';
import { isLoggedIn } from '../guards/isLoggedIn.guard';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: BillManagementComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'lho-management',
        component: LhoManagementComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'add-payment-details/:billId',
        component: AddPaymentDetailsComponent,
        canActivate: [isLoggedIn],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [isLoggedIn],
      },
    ],
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
  },
  {
    path: 'lho-management',
    component: LhoManagementComponent,
  },
  {
    path: 'add-payment-details/:billId',
    component: AddPaymentDetailsComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
