import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verify-otp',
    component: VerifyOtpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'set-password',
    component: SetPasswordComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
