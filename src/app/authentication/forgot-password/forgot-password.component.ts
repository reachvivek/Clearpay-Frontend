import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  public passwordType = true;
  public showLoader = false;
  public forgotPasswordForm = {
    employeecode: '',
  };

  showInvalidCredentials = false;
  showAccountBlocked = false;
  showAccountInactive = false;
  showTooManyRequests = false;

  isInputFocusedOrTyped: boolean = false;

  constructor(
    private userSyncService: UserSyncService,
    private router: Router // private _matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoggedIn();
  }

  clearAllInfo() {
    this.showAccountBlocked = false;
    this.showInvalidCredentials = false;
    this.showAccountInactive = false;
    this.showTooManyRequests = false;
  }

  isLoggedIn() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  onSubmit = async () => {
    // console.log(this.loginForm)
    this.clearAllInfo();
    this.showLoader = true;
    if (!this.forgotPasswordForm.employeecode) {
      this.showLoader = false;
      return;
    }
    try {
      this.showLoader = true;
      const res = await this.userSyncService.sendForgotPasswordOTP(
        this.forgotPasswordForm
      );
      if (res) {
        this.showLoader = false;
        this.router.navigate(['/verify-otp']);
      } else {
        console.error(res);
        this.showLoader = false;
      }
    } catch (err: any) {
      if (['User not found!'].includes(err.error.toString())) {
        this.showInvalidCredentials = true;
      }
      if (err.error.toString().includes('Blocked')) {
        this.showAccountBlocked = true;
      }
      if (err.error.toString().includes('Inactive')) {
        this.showAccountInactive = true;
      }
      if (err.error.toString().includes('Too many requests.')) {
        this.showTooManyRequests = true;
      }
      this.showLoader = false;
    }
  };

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
