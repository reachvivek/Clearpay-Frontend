import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { LhoManagementComponent } from './lho-management/lho-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      { path: 'lho-management', component: LhoManagementComponent },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
