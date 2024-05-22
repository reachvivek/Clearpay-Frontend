import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { UserSyncService } from '../../services/user-sync.service';
import { filter, firstValueFrom, map, startWith } from 'rxjs';
import { AdminService, AuthService } from '../../../swagger';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  routeTitle: string = 'Dashboard';
  showLoader: boolean = false;
  isManagementRoute: boolean = false;
  isSubMenuOpen: boolean = false;
  isSidebarOpen: boolean = true;
  isAdminUser: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  closeSubMenu() {
    this.isSubMenuOpen = false;
  }

  async logout() {
    this.showLoader = true;
    this.userSyncService
      .logout()
      .then(() => (this.showLoader = false))
      .catch((err) => console.log(err));
  }

  constructor(
    private router: Router,
    private userSyncService: UserSyncService
  ) {}

  ngOnInit(): void {
    const routeTitlesMap = new Map<string, string>([
      ['user-management', 'User Management'],
      ['lho-management', 'LHO Management'],
      ['add-payment-details', 'Add Payment Details'],
      ['reports', 'Reports'],
    ]);

    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      for (const [route, title] of routeTitlesMap) {
        if (currentUrl.includes(route)) {
          this.routeTitle = title;
          break;
        } else {
          this.routeTitle = 'Dashboard';
        }
      }
      if (currentUrl.includes('add-payment-details')) {
        this.isSidebarOpen = false;
      } else {
        this.isSidebarOpen = true;
      }
    });
    this.userSyncService.loadState();
    this.userSyncService.checkUserPrivileges();
    this.userSyncService.isAdmin$.subscribe((isAdmin) => {
      this.isAdminUser = isAdmin;
    });
  }
}
