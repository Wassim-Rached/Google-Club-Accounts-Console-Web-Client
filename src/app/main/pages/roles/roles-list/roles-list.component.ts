import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {
  roles?: Page<Role>;
  searchTimeoutId?: number;
  currentPage: number = 0;
  currentSortTerm: string = 'scope';
  currentSortDirection: string = 'asc';

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.searchRoles();
  }

  searchRoles(publicName: string = '', applyWait: boolean = false): void {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }

    const executeSearch = () => {
      const page = this.currentPage;
      const size = 5;
      const sort = this.currentSortTerm;
      const direction = this.currentSortDirection;
      this.roles = undefined;
      this.rolesService.searchRoles(page, size, sort, direction, publicName).subscribe({
        next: (roles) => {
          this.roles = roles;
        },
        error: (error) => {
          console.error(error);
          this.roles = null;
        }
      });
    };

    if (applyWait) {
      this.searchTimeoutId = window.setTimeout(executeSearch, 800);
    } else {
      executeSearch();
    }
  }

  sortRoles(sort: string): void {
    const [currentSortTerm, currentSortDirection] = sort.split(',');
    this.currentSortTerm = currentSortTerm;
    this.currentSortDirection = currentSortDirection;
    this.searchRoles();
  }

  searchNextRolesPage() {
    this.currentPage++;
    this.searchRoles();
  }

  searchPreviousRolesPage() {
    this.currentPage--;
    this.searchRoles();
  }

  searchRolesPage(page: number) {
    this.currentPage = page;
    this.searchRoles();
  }

  public get rolesHasNextPage() {
    return this.roles && this.roles.page.totalPages > this.currentPage + 1;
  }

  public get rolesHasPreviousPage() {
    return this.roles && this.currentPage > 0;
  }
}
