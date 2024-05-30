import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminService, Lho, LhoService, State, User } from '../../../swagger';
import { UserSyncService } from '../../services/user-sync.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-lho-management',
  templateUrl: './lho-management.component.html',
  styleUrl: './lho-management.component.scss',
})
export class LhoManagementComponent {
  showLoader: boolean = false;
  users: User[] | any[] = [];
  lhoDialog: boolean = false;
  lhos!: Lho[] | any;
  lho!: Lho;
  selectedLhos!: Lho[] | null;
  newLho: Lho = {};
  selectedLho!: any;
  isEditMode: boolean = false;
  submitted: boolean = false;
  statuses!: any[];
  states: State[] = [];
  selectedStates: any = [];
  selectedUsers: any[] = [];
  roles: [{ id: 2; name: 'LHO User' }, { id: 3; name: 'Finance User' }] = [
    { id: 2, name: 'LHO User' },
    { id: 3, name: 'Finance User' },
  ];
  userMap = new Map<number, string>();

  constructor(
    private userSyncService: UserSyncService,
    private lhoService: LhoService,
    private adminService: AdminService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  async ngOnInit() {
    await this.userSyncService.loadState();
    await this.loadUsers();
    await this.loadLhos();
    await this.loadStates();
  }

  showSelected() {
    let stateNames = '';
    this.selectedStates.map((val: any) => {
      stateNames =
        stateNames + (stateNames.length > 0 ? ', ' : '') + val.state_Name;
    });
    this.newLho.state = stateNames;
  }

  showSelectedUsers() {
    console.log(this.selectedUsers);
    const userIds: any = [];
    this.selectedUsers.map((entry: any) => {
      userIds.push(entry.userId);
    });
    this.newLho.userIds = JSON.stringify(userIds);
    console.log(this.newLho.userIds);
  }

  async loadStates() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(this.lhoService.lhoGetStatesGet());
      if (res && res.length) {
        this.states = [...res];
      }
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

  async loadUsers() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(this.adminService.adminGetLhoUsersGet());
      if (res && res.length) {
        this.users = [...res];
      }
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

  async loadLhos() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(this.lhoService.lhoGetLhosGet());
      if (res && res.length) {
        this.lhos = [...res];

        // Create a map for quick lookup of userId to empName

        this.users.forEach((user: User) => {
          this.userMap.set(user.userId!, user.empName!);
        });

        // Iterate over lhos and map userIds to empNames
        this.lhos.forEach((entry: any) => {
          entry.userIds = JSON.parse(entry.userIds);
          entry.empNames = entry.userIds
            .map((userId: number) => this.userMap.get(userId))
            .filter((empName: string | undefined) => empName !== undefined);

          // Join the empNames with comma if there are multiple names
          entry.empNames = entry.empNames.join(', ');
        });
      }
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
    this.newLho = {};
    this.selectedStates = [];
    this.selectedUsers = [];
    this.isEditMode = false;
    this.submitted = false;
    this.lhoDialog = true;
  }

  editLho(lho: Lho) {
    this.isEditMode = true;
    this.selectedLho = { ...lho };
    this.newLho = { ...lho };
    this.lhoDialog = true;
    let statesArray = this.selectedLho.state?.split(', ');
    this.selectedStates = [];
    statesArray?.forEach((item: any) => {
      this.selectedStates.push({ state_Name: item });
    });
    this.selectedUsers = [];
    const userIds = this.selectedLho.userIds;
    if (typeof userIds === 'string') {
      this.selectedLho.userIds = JSON.parse(userIds);
    }

    this.selectedUsers = this.users.filter((user) =>
      this.selectedLho.userIds.includes(user.userId)
    );
  }

  checkChanges() {
    if (
      this.selectedLho.lhoName !== this.newLho.lhoName ||
      this.selectedLho.state !== this.newLho.state ||
      this.selectedLho.userIds?.length !== this.newLho.userIds?.length
    ) {
      return false;
    }
    return true;
  }

  async deleteLho(lho: Lho) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove ' + lho.lhoName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          this.showLoader = true;
          const res = await firstValueFrom(
            this.lhoService.lhoDeleteLhoLhoIDDelete(lho.lhoID!)
          );
          this.showLoader = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'LHO Deleted Successfully!',
            life: 3000,
          });
          await this.loadLhos();
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
    this.lhoDialog = false;
    this.submitted = false;
  }

  async saveLho() {
    switch (this.isEditMode) {
      case false:
        this.createNewLho();
        break;
      case true:
        this.updateSelectedLho();
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

  async createNewLho() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(
        this.lhoService.lhoCreateLhoPost(this.newLho)
      );
      this.loadLhos();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'LHO Created Successfully!',
        life: 3000,
      });
      this.showLoader = false;
      this.hideDialog();
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.toString(),
        life: 3000,
      });
    }
  }

  async updateSelectedLho() {
    try {
      this.showLoader = true;
      const res = await firstValueFrom(
        this.lhoService.lhoUpdateLhoPut(this.newLho!)
      );
      this.loadLhos();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'LHO Updated Successfully!',
        life: 3000,
      });
      this.showLoader = false;
      this.isEditMode = false;
      this.hideDialog();
    } catch (err: any) {
      console.error(err);
      this.showLoader = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.toString(),
        life: 3000,
      });
    }
  }
}
