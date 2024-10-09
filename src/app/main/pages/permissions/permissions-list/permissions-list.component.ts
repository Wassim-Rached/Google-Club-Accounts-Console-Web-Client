import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss'
})
export class PermissionsListComponent implements OnInit {
  permissions?: Page<Permission>;
  searchTimeoutId?: number;
  currentPage: number = 0;
  currentSortTerm: string = 'scope';
  currentSortDirection: string = 'asc';

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    // get current page from route params
    this.searchPermissions();
  }

  searchPermissions(publicName: string = ''): void {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }
    this.searchTimeoutId = window.setTimeout(() => {
      const page = this.currentPage;
      const size = 5;
      const sort = this.currentSortTerm;
      const direction = this.currentSortDirection;
      this.searchTimeoutId = undefined;
      this.permissions = undefined;
      this.permissionsService.searchPermissions(page, size, sort, direction, publicName).subscribe({
        next: (permissions) => {
          this.permissions = permissions;
        },
        error: (error) => {
          console.error(error);
          this.permissions = null;
        }
      });
    }, 800);
  }

  sortPermissions(sort: string): void {
    const [currentSortTerm, currentSortDirection] = sort.split(',');
    this.currentSortTerm = currentSortTerm;
    this.currentSortDirection = currentSortDirection;
    this.searchPermissions();
  }

  searchNextPermissionsPage() {
    this.currentPage++;
    this.searchPermissions();
  }

  searchPreviousPermissionsPage() {
    this.currentPage--;
    this.searchPermissions();
  }

  searchPermissionsPage(page: number) {
    this.currentPage = page;
    this.searchPermissions();
  }

  public get permissionsHasNextPage() {
    return this.permissions && this.permissions.page.totalPages > this.currentPage + 1;
  }

  public get permissionsHasPreviousPage() {
    return this.permissions && this.currentPage > 0;
  }
}
