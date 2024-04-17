import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isManagementRoute: boolean = false;

  isSubMenuOpen: boolean = false;

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  closeSubMenu() {
    this.isSubMenuOpen = false;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isManagementRoute = this.router.url.includes('/management');
  }
}
