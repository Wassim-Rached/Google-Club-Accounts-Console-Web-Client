import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Account } from 'src/app/services/accounts/accounts.service';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { Role, RoleEditRequest, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { SearchAccountsComponent } from '../../../components/search-account-grant-role/search-accounts.component';
import { SearchPermissionsComponent } from '../../../components/search-permissions/search-permissions.component';
import { ToastrService } from 'ngx-toastr';
import { SearchRolesComponent } from '../../../components/search-roles/search-roles.component';

@Component({
  selector: 'app-roles-details',
  standalone: true,
  imports: [RouterModule, SharedModule, SearchAccountsComponent, SearchPermissionsComponent, SearchRolesComponent],
  templateUrl: './roles-details.component.html',
  styleUrl: './roles-details.component.scss'
})
export class RolesDetailsComponent implements OnInit {
  @ViewChild(SearchPermissionsComponent)
  grantPermissionsChild: SearchPermissionsComponent;
  @ViewChild(SearchAccountsComponent)
  grantAccountChild: SearchAccountsComponent;

  role?: Role;
  defaultPhotoUrl = environment.defaultPhotoUrl;
  toBeGrantedPermissions: Permission[] = [];
  toBeRevokedPermissions: Permission[] = [];
  toBeGrantedToAccounts: Account[] = [];
  toBeRevokedFromAccounts: Account[] = [];
  isSavingChanges = false;
  isDeletingRole = false;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.refreshRole();
  }

  refreshRole() {
    const roleId = this.route.snapshot.params['id'];
    this.role = undefined;
    this.rolesService.getRoleById(roleId).subscribe({
      next: (role) => {
        this.role = role;
      },
      error: (error) => {
        if (error.status === 404) {
          this.role = null;
        }
        console.error(error);
      }
    });
  }

  deleteRole() {
    const confirmation = confirm(
      'Are you sure you want to delete this role? All related relations with accounts and permissions for this role will be lost.'
    );
    if (!confirmation) return;
    const rolePublicName = RolesService.getRolePublicName(this.role);
    const input = prompt('Type the role name to confirm deletion');
    if (input !== rolePublicName) {
      this.toastrService.error('Role name does not match');
      return;
    }
    const roleId = this.route.snapshot.params['id'];
    this.isDeletingRole = true;
    this.rolesService.deleteRole(roleId).subscribe({
      next: () => {
        this.toastrService.success('Role deleted successfully');
        this.isDeletingRole = false;
        this.router.navigate(['/roles']);
      },
      error: (error) => {
        console.log(error.error);
        const errorMessage = error.error || 'Failed to delete role';
        console.log(error);
        this.toastrService.error(errorMessage);
        this.isDeletingRole = false;
      }
    });
  }

  // account related methods
  toggleAccountRevocation(account: Account) {
    if (this.isAccountWaitingToBeRevoked(account)) {
      this.toBeRevokedFromAccounts = this.toBeRevokedFromAccounts.filter((a) => a.id !== account.id);
    } else {
      this.toBeRevokedFromAccounts.push(account);
    }
  }

  toggleAccountGrant(account: Account) {
    // it accually allows to revoke accounts
    // not a toggle
    // used to call the child method to mimic
    // him unchoosing the role
    this.grantAccountChild.unchoseaccount(account);
  }

  onAccountChosen(account: Account) {
    this.toBeGrantedToAccounts.push(account);
  }

  onAccountUnchosen(account: Account) {
    this.toBeGrantedToAccounts = this.toBeGrantedToAccounts.filter((a) => a.id !== account.id);
  }

  clearChosenAccounts() {
    this.toBeGrantedToAccounts = [];
  }

  get accountsToBeGranted() {
    return this.toBeGrantedToAccounts;
  }

  get accountsToBeRevoked() {
    return this.toBeRevokedFromAccounts;
  }

  isAccountWaitingToBeRevoked(account: Account) {
    return this.toBeRevokedFromAccounts.filter((a) => a.id === account.id).length > 0;
  }

  isAccountWaitingToBeGranted(account: Account) {
    return this.toBeGrantedToAccounts.filter((a) => a.id === account.id).length > 0;
  }

  // permission related methods
  togglePermissionRevocation(permission: Permission) {
    if (this.isPermissionWaitingToBeRevoked(permission)) {
      this.toBeRevokedPermissions = this.toBeRevokedPermissions.filter((p) => p.id !== permission.id);
    } else {
      this.toBeRevokedPermissions.push(permission);
    }
  }

  togglePermissionGrant(permission: Permission) {
    // it accually allows to revoke permissions
    // not a toggle
    // used to call the child method to mimic
    // him unchoosing the role
    this.grantPermissionsChild.unchosePermission(permission);
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

  get hasChanges() {
    return (
      this.accountsToBeGranted.length > 0 ||
      this.permissionsToBeGranted.length > 0 ||
      this.permissionsToBeRevoked.length > 0 ||
      this.accountsToBeRevoked.length > 0
    );
  }

  isPermissionWaitingToBeRevoked(permission: Permission) {
    return this.toBeRevokedPermissions.filter((p) => p.id === permission.id).length > 0;
  }

  isPermissionWaitingToBeGranted(permission: Permission) {
    return this.toBeGrantedPermissions.filter((p) => p.id === permission.id).length > 0;
  }

  // submit changes
  saveChanges() {
    const body: RoleEditRequest = {
      publicName: RolesService.getRolePublicName(this.role),
      permissions: {
        grant: this.toBeGrantedPermissions.map((p) => PermissionsService.getPermissionPublicName(p)),
        revoke: this.toBeRevokedPermissions.map((p) => RolesService.getRolePublicName(p))
      },
      accounts: {
        grant: this.toBeGrantedToAccounts.map((a) => a.email),
        revoke: this.toBeRevokedFromAccounts.map((a) => a.email)
      }
    };

    this.isSavingChanges = true;
    this.rolesService.editRole(body).subscribe({
      next: (response) => {
        this.clearChanges();
        this.refreshRole();
        this.toastrService.success('Changes saved successfully');
        this.isSavingChanges = false;
      },
      error: (error) => {
        console.error(error);
        const errorMessage = error.error || 'Failed to save changes';
        this.toastrService.error(errorMessage);
        this.isSavingChanges = false;
      }
    });
  }

  clearChanges() {
    this.grantAccountChild.clearChosenaccounts();
    this.grantPermissionsChild.clearChosenPermissions();
    this.toBeGrantedPermissions = [];
    this.toBeRevokedPermissions = [];
    this.toBeGrantedToAccounts = [];
    this.toBeRevokedFromAccounts = [];
  }

  downloadRoleJson() {
    const roleJson = RolesService.generateRoleExportJson(this.role);
    const blob = new Blob([roleJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.role.name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
