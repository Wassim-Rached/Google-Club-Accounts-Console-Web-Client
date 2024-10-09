import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-search-grant-role-permission',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './search-grant-role-permission.component.html',
  styleUrl: './search-grant-role-permission.component.scss'
})
export class SearchGrantRolePermissionComponent implements OnInit {
  permissions?: Page<Permission>;
  chosenPermissions: Permission[] = [];
  searchTimeoutId?: number;
  @Output() permissionChosen = new EventEmitter<Permission>();
  @Output() permissionUnchosen = new EventEmitter<Permission>();

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.refreshPermissions();
  }

  getPermissionPublicName(permission: Permission) {
    return permission.scope + '.perm.' + permission.name;
  }

  refreshPermissions(publicName: string = '') {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }

    if (publicName === null || publicName === undefined || publicName === '') {
      this.permissions = { content: [], page: { size: 5, totalElements: 0, totalPages: 0, number: 0 } };
      return;
    }

    this.searchTimeoutId = window.setTimeout(() => {
      const page = 0;
      const size = 5;
      const sort = 'scope';
      const direction = 'asc';
      this.permissions = undefined;
      this.permissionsService.searchPermissions(page, size, sort, direction, publicName).subscribe({
        next: (permissions) => {
          this.permissions = permissions;
          // remove permissions that have already been chosen
        },
        error: (error) => {
          console.error(error);
        }
      });
    }, 300); // Adjust the timeout duration as needed
  }

  haveBeenChosen(permission: Permission) {
    return this.chosenPermissions.filter((p) => p.id === permission.id).length > 0;
  }

  chosePermission(permission: Permission) {
    if (!this.permissions || !this.permissions.content) return;
    this.chosenPermissions.push(permission);
    this.permissionChosen.emit(permission);
  }

  unchosePermission(permission: Permission) {
    if (!this.permissions || !this.permissions.content) return;
    this.chosenPermissions = this.chosenPermissions.filter((p) => p.id !== permission.id);
    this.permissionUnchosen.emit(permission);
  }

  public clearChosenPermissions() {
    this.chosenPermissions = [];
  }
}
