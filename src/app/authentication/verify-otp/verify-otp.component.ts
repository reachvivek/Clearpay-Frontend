import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss',
})
export class VerifyOtpComponent {
  public showLoader = false;
  showIncorrectOTP = false;
  showAccountBlocked = false;
  showOTPSent = true;
  isDisabled = true;
  public otpForm = {
    otp: '',
  };
  public otpLength: number = 6;

  isInputFocusedOrTyped: boolean = false;

  constructor(
    private userSyncService: UserSyncService,
    private router: Router // private _matSnackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    try {
      this.disableOTPBtnTemp(30000);
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
      const creds = sessionStorage.getItem('credentials');
      if (!creds || !creds.length) {
        this.router.navigate(['/login']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  disableOTPBtnTemp(time: number) {
    this.isDisabled = true;
    setTimeout(() => {
      this.isDisabled = false;
    }, 30000);
  }

  onSubmit = async () => {
    this.showLoader = true;
    if (!this.otpForm.otp) {
      this.showLoader = false;
      return;
    } else {
      this.verifyOtp();
    }
  };

  clearMessages() {
    this.showAccountBlocked = false;
    this.showIncorrectOTP = false;
    this.showOTPSent = false;
  }

  async resendOTP() {
    this.clearMessages();
    try {
      this.showIncorrectOTP = false;
      this.showLoader = true;
      let res;
      switch (sessionStorage.getItem('action')) {
        case 'login':
          {
            res = await this.userSyncService.sendLoginOTP(
              JSON.parse(sessionStorage.getItem('credentials')!)
            );
          }
          break;
        case 'forgotpassword':
          {
            res = await this.userSyncService.sendForgotPasswordOTP(
              JSON.parse(sessionStorage.getItem('credentials')!)
            );
          }
          break;
      }
      if (res) {
        this.showOTPSent = true;
        this.disableOTPBtnTemp(30000);
      }
      this.showLoader = false;
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
      if (err.error.toString().includes('Blocked')) {
        this.showAccountBlocked = true;
        this.disableOTPBtnTemp(30000);
      }
    }
  }

  autoSubmit() {
    if (this.otpForm.otp.length == 6) {
      this.onSubmit();
    }
  }

  async verifyOtp() {
    this.clearMessages();
    try {
      this.showOTPSent = false;
      this.showLoader = true;
      let res;
      switch (sessionStorage.getItem('action')) {
        case 'login':
          {
            res = await this.userSyncService.login(this.otpForm.otp);
            if (res && res.token && res.token.length) {
              this.showLoader = false;
              this.router.navigate(['/dashboard']);
            } else {
              console.error(res);
              this.showLoader = false;
            }
          }
          break;
        case 'forgotpassword':
          {
            res = await this.userSyncService.verifySetNewPasswordOTP(
              this.otpForm.otp
            );
            if (res && res.token && res.token.length) {
              this.showLoader = false;
              this.router.navigate(['/set-password']);
            } else {
              console.error(res);
              this.showLoader = false;
            }
          }
          break;
      }
    } catch (err: any) {
      this.showLoader = false;
      if (err!.error.toString() == 'Incorrect OTP') {
        this.showIncorrectOTP = true;
      }
      if (err.error.toString().includes('Blocked')) {
        this.showAccountBlocked = true;
      }
    }
  }

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
