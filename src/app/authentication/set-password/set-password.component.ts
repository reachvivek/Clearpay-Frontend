import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss',
})
export class SetPasswordComponent {
  public showLoader = false;

  isInputFocusedOrTyped: boolean = false;
  private token: string | undefined;
  public newPassword: string = '';
  public confirmPassword: string = '';
  public newPasswordType = true;
  public confirmPasswordType = true;
  public showConfirmPasswordError = false;

  public isPasswordFocused = false;
  public hasUppercase = false;
  public hasLowercase = false;
  public hasSpecialCharacter = false;
  public hasMinLength = false;

  constructor(
    private userSyncService: UserSyncService,
    private messageService: MessageService,
    private router: Router // private _matSnackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.checktoken();
  }

  checktoken() {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        this.router.navigate(['/auth']);
      }
    } catch (err) {
      console.log(err);
    }
  }
  showPasswordRules() {
    this.isPasswordFocused = true;
    this.isInputFocusedOrTyped = true;
  }

  hidePasswordRules() {
    this.isPasswordFocused = false;
    this.onInputBlur();
  }

  updatePasswordRules() {
    this.hasUppercase = /[A-Z]/.test(this.newPassword!);
    this.hasLowercase = /[a-z]/.test(this.newPassword!);
    this.hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      this.newPassword!
    );
    this.hasMinLength = this.newPassword!.length >= 8;
  }

  onSubmit = async () => {
    this.showLoader = true;
    if (!this.newPassword || !this.confirmPassword) {
      this.showLoader = false;
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.showLoader = false;
      return;
    }
    if (this.newPassword.length < 8) {
      this.showLoader = false;
      return;
    }
    try {
      const res = await this.userSyncService.setNewPassword({
        password: this.newPassword,
      });
      if (res) {
        this.showLoader = false;
        localStorage.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Password Changed Successfully. Redirecting...',
          life: 3000,
        });
        setTimeout(
          () => this.router.navigate(['/auth'], { replaceUrl: true }),
          3000
        );
      }
    } catch (err: any) {
      console.log(err);
      this.showLoader = false;
    }
  };

  checkForm() {
    if (
      this.newPassword !== this.confirmPassword ||
      this.newPassword.length < 8 ||
      this.confirmPassword.length < 8
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  onInputFocusOrTyping() {
    this.isInputFocusedOrTyped = true;
  }

  onInputBlur() {
    this.isInputFocusedOrTyped = false;
  }
}
