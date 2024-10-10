import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SearchGrantRolePermissionComponent } from 'src/app/main/components/search-grant-role-permission/search-grant-role-permission.component';
import { Account, AccountEditRequest, AccountsService } from 'src/app/services/accounts/accounts.service';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { Role, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SearchAccountGrantRoleComponent } from '../../../components/search-account-grant-role/search-account-grant-role.component';
import { SearchRolesComponent } from '../../../components/search-roles/search-roles.component';

@Component({
  selector: 'app-accounts-details',
  standalone: true,
  imports: [SharedModule, RouterModule, SearchAccountGrantRoleComponent, SearchGrantRolePermissionComponent, SearchRolesComponent],
  templateUrl: './accounts-details.component.html',
  styleUrl: './accounts-details.component.scss'
})
export class AccountsDetailsComponent implements OnInit {
  @ViewChild(SearchGrantRolePermissionComponent)
  grantPermissionsChild: SearchGrantRolePermissionComponent;

  @ViewChild(SearchRolesComponent)
  grantRolesChild: SearchRolesComponent;

  account?: Account;
  // isCollapsedRole = true;
  toBeGrantedPermissions: Permission[] = [];
  toBeRevokedPermissions: Permission[] = [];
  toBeGrantedRoles: Role[] = [];
  toBeRevokedRoles: Role[] = [];
  isSavingChanges = false;
  isDeletingAccount = false;
  isSuspendingAccount = false;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.refreshAccount();
  }

  refreshAccount() {
    const accountId = this.route.snapshot.params['id'];
    this.accountsService.getAccountById(accountId).subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (error) => {
        if (error.status === 404) {
          this.account = null;
        }
        console.error(error);
      }
    });
  }

  // role related methods
  toggleRoleRevocation(role: Role) {
    if (this.isRoleWaitingToBeRevoked(role)) {
      this.toBeRevokedRoles = this.toBeRevokedRoles.filter((a) => a.id !== role.id);
    } else {
      this.toBeRevokedRoles.push(role);
    }
  }

  onRoleChosen(role: Role) {
    this.toBeGrantedRoles.push(role);
  }

  onRoleUnchosen(role: Role) {
    this.toBeGrantedRoles = this.toBeGrantedRoles.filter((a) => a.id !== role.id);
  }

  clearChosenRoles() {
    this.toBeGrantedRoles = [];
  }

  get rolesToBeGranted() {
    return this.toBeGrantedRoles;
  }

  get rolesToBeRevoked() {
    return this.toBeRevokedRoles;
  }

  isRoleWaitingToBeRevoked(role: Role) {
    return this.toBeRevokedRoles.filter((a) => a.id === role.id).length > 0;
  }

  isRoleWaitingToBeGranted(role: Role) {
    return this.toBeGrantedRoles.filter((a) => a.id === role.id).length > 0;
  }

  // permission related methods
  togglePermissionRevocation(permission: Permission) {
    if (this.isPermissionWaitingToBeRevoked(permission)) {
      this.toBeRevokedPermissions = this.toBeRevokedPermissions.filter((p) => p.id !== permission.id);
    } else {
      this.toBeRevokedPermissions.push(permission);
    }
  }

  onPermissionChosen(permission: Permission) {
    this.toBeGrantedPermissions.push(permission);
  }

  onPermissionUnchosen(permission: Permission) {
    this.toBeGrantedPermissions = this.toBeGrantedPermissions.filter((p) => p.id !== permission.id);
  }

  clearChosenPermissions() {
    this.toBeGrantedPermissions = [];
    this.grantPermissionsChild.clearChosenPermissions();
  }

  get permissionsToBeGranted() {
    return this.toBeGrantedPermissions;
  }

  get permissionsToBeRevoked() {
    return this.toBeRevokedPermissions;
  }

  isPermissionWaitingToBeRevoked(permission: Permission) {
    return this.toBeRevokedPermissions.filter((p) => p.id === permission.id).length > 0;
  }

  isPermissionWaitingToBeGranted(permission: Permission) {
    return this.toBeGrantedPermissions.filter((p) => p.id === permission.id).length > 0;
  }

  get hasChanges() {
    return (
      this.rolesToBeGranted.length > 0 ||
      this.permissionsToBeGranted.length > 0 ||
      this.permissionsToBeRevoked.length > 0 ||
      this.rolesToBeRevoked.length > 0
    );
  }

  // submit changes
  saveChanges() {
    const body: AccountEditRequest = {
      email: this.account.email,
      permissions: {
        grant: this.toBeGrantedPermissions.map(PermissionsService.getPermissionPublicName),
        revoke: this.toBeRevokedPermissions.map(PermissionsService.getPermissionPublicName)
      },
      roles: {
        grant: this.toBeGrantedRoles.map(RolesService.getRolePublicName),
        revoke: this.toBeRevokedRoles.map(RolesService.getRolePublicName)
      }
    };

    console.log(JSON.stringify(body));

    this.isSavingChanges = true;
    this.accountsService.editAccount(body).subscribe({
      next: (response) => {
        console.log(response);
        this.clearChanges();
        this.refreshAccount();
        alert('Account updated successfully');
        this.isSavingChanges = false;
      },
      error: (error) => {
        console.error(error);
        alert('Failed to update account');
        this.isSavingChanges = false;
      }
    });
  }

  clearChanges() {
    this.grantRolesChild.clearChosenRoles();
    this.grantPermissionsChild.clearChosenPermissions();
    this.toBeGrantedPermissions = [];
    this.toBeRevokedPermissions = [];
    this.toBeGrantedRoles = [];
    this.toBeRevokedRoles = [];
  }

  deleteAccount() {
    alert('Not implemented yet');
  }

  suspendAccount() {
    alert('Not implemented yet');
  }
}
