import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Role, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-search-roles',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './search-roles.component.html',
  styleUrl: './search-roles.component.scss'
})
export class SearchRolesComponent implements OnInit {
  roles?: Page<Role>;
  chosenRoles: Role[] = [];
  searchTimeoutId?: number;
  @Output() roleChosen = new EventEmitter<Role>();
  @Output() roleUnchosen = new EventEmitter<Role>();

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.refreshRoles();
  }

  refreshRoles(publicName: string = '') {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }

    if (publicName === null || publicName === undefined || publicName === '') {
      this.roles = { content: [], page: { size: 5, totalElements: 0, totalPages: 0, number: 0 } };
      return;
    }

    this.searchTimeoutId = window.setTimeout(() => {
      const page = 0;
      const size = 5;
      const sort = 'scope';
      const direction = 'asc';
      this.roles = undefined;
      this.rolesService.searchRoles(page, size, sort, direction, publicName).subscribe({
        next: (roles) => {
          this.roles = roles;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }, 300);
  }

  haveBeenChosen(permission: Role) {
    return this.chosenRoles.filter((p) => p.id === permission.id).length > 0;
  }

  choseRole(permission: Role) {
    if (!this.roles || !this.roles.content) return;
    this.chosenRoles.push(permission);
    this.roleChosen.emit(permission);
  }

  unchoseRole(role: Role) {
    if (!this.roles || !this.roles.content) return;
    this.chosenRoles = this.chosenRoles.filter((p) => p.id !== role.id);
    this.roleUnchosen.emit(role);
  }

  public clearChosenRoles() {
    this.chosenRoles = [];
  }
}
