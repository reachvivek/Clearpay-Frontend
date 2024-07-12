import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public passwordType = true;
  public showLoader = false;
  showInvalidCredentials = false;
  showAccountBlocked = false;
  showAccountInactive = false;
  showTooManyRequests = false;
  public loginForm = {
    employeecode: '',
    password: '',
  };
  isInputFocusedOrTyped: boolean = false;

  constructor(
    private userSyncService: UserSyncService,
    private router: Router
  ) {}
  ngOnInit(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.log(err);
    }
  }

  clearAllInfo() {
    this.showAccountBlocked = false;
    this.showInvalidCredentials = false;
    this.showAccountInactive = false;
    this.showTooManyRequests = false;
  }

  onSubmit = async () => {
    this.clearAllInfo();
    this.showLoader = true;
    if (!this.loginForm.employeecode || !this.loginForm.password) {
      this.showLoader = false;
      return;
    } else {
      try {
        this.showLoader = true;
        const res = await this.userSyncService.sendLoginOTP(this.loginForm);
        if (res) {
          this.showLoader = false;
          this.router.navigate(['/verify-otp']);
        } else {
          console.error(res);
          this.showLoader = false;
        }
      } catch (err: any) {
        if (
          ['Incorrect Password', 'User not found!'].includes(
            err.error.toString()
          )
        ) {
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
    }
  };

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
