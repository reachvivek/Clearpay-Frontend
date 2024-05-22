import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService, AdminToAddDto, AdminToEditDto } from '../../../swagger';
import { firstValueFrom } from 'rxjs';
import { UserSyncService } from '../../services/user-sync.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  isEditMode: boolean = false;
  isDeleteMode: boolean = false;
  isBulkDeleteMode: boolean = false;

  showLoader: boolean = false;
  userDialog: boolean = false;

  users!: AdminToAddDto[] | any;

  user!: AdminToEditDto;

  selectedUser: AdminToEditDto = {};

  selectedUsers!: AdminToAddDto[] | null;

  newUser: AdminToAddDto = {};

  submitted: boolean = false;

  statuses!: any[];

  roles: [{ id: 2; name: 'LHO User' }, { id: 3; name: 'Finance User' }] = [
    { id: 2, name: 'LHO User' },
    { id: 3, name: 'Finance User' },
  ];

  constructor(
    private adminService: AdminService,
    private userSyncService: UserSyncService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    await this.userSyncService.loadState();
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(this.adminService.adminGetUsersGet());
      if (res && res.length) {
        this.users = [...res];
      }
      this.statuses = [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ];
      this.showLoader = false;
    } catch (err: any) {
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.toString(),
        life: 3000,
      });
    }
  }

  openNew() {
    this.newUser = {};
    this.isEditMode = false;
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter(
          (val: any) => !this.selectedUsers?.includes(val)
        );
        this.selectedUsers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Users Deleted',
          life: 3000,
        });
      },
    });
  }

  editUser(user: AdminToAddDto) {
    this.isEditMode = true;
    this.selectedUser = { ...user };
    this.newUser = { ...user };
    this.userDialog = true;
  }

  checkChanges() {
    if (
      this.selectedUser.empName !== this.newUser.empName ||
      this.selectedUser.empEmail !== this.newUser.empEmail ||
      this.selectedUser.empMobNo !== this.newUser.empMobNo ||
      this.selectedUser.empCode !== this.newUser.empCode ||
      this.selectedUser.empRoleID !== this.newUser.empRoleID ||
      this.selectedUser.active !== this.newUser.active
    ) {
      return false;
    }
    return true;
  }

  async deleteUser(user: AdminToEditDto) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove ' + user.empName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          this.showLoader = true;
          await firstValueFrom(
            this.adminService.adminDeleteUserUserIdDelete(user.userId!)
          );
          this.showLoader = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Deleted Successfully!',
            life: 3000,
          });
          this.loadUsers();
        } catch (err: any) {
          this.showLoader = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.toString(),
            life: 3000,
          });
        }
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  async saveUser() {
    switch (this.isEditMode) {
      case false:
        this.createNewUser();
        break;
      case true:
        this.updateSelectedUser();
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: '404 - Bad Request',
          life: 3000,
        });
        break;
    }
  }

  async createNewUser() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(
        this.adminService.adminCreateUserPost(this.newUser)
      );
      this.loadUsers();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User Created Successfully!',
        life: 3000,
      });
      this.showLoader = false;
      this.hideDialog();
    } catch (err: any) {
      console.log(err);
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.toString(),
        life: 3000,
      });
    }
  }

  async updateSelectedUser() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(
        this.adminService.adminEditUserUserIdPut(
          this.selectedUser.userId!,
          this.newUser!
        )
      );
      this.loadUsers();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'User Updated Successfully!',
        life: 3000,
      });
      this.showLoader = false;
      this.isEditMode = false;
      this.hideDialog();
    } catch (err: any) {
      console.log(err);
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.toString(),
        life: 3000,
      });
    }
  }

  getSeverity(status: any) {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return 'success';
    }
  }
}
