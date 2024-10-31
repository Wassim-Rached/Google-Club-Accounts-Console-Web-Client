import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission, PermissionImportRequest, PermissionImportResponse, PermissionsService } from '../permissions.service';
import { Account } from '../accounts/accounts.service';
import { Page } from 'src/types';

export interface RoleImportRequest {
  name: string;
  scope: string;
  description: string;
  permissions: PermissionImportRequest[];
}

export interface RoleImportResponse {
  rolePublicName: string;
  status: 'created' | 'skipped';
  permissions: PermissionImportResponse[];
}

export interface RoleEditResponse {
  rolePublicName: string;
  permissions: {
    granted: string[];
    revoked: string[];
  };
  accounts: {
    granted: string[];
    revoked: string[];
  };
}

export interface RoleEditRequest {
  publicName: string;
  permissions: {
    grant: string[];
    revoke: string[];
  };
  accounts: {
    grant: string[];
    revoke: string[];
  };
}

export interface Role {
  id: string;
  name: string;
  scope: string;
  description?: string;
  permissions?: Permission[];
  accounts?: Account[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) {}

  searchRoles(
    page: number = 0,
    size: number = 10,
    sort: string = 'scope',
    direction = 'asc',
    publicName: string = ''
  ): Observable<Page<Role>> {
    return this.http.get<Page<Role>>(
      `${environment.ics}/api/roles?page=${page}&size=${size}&sort=${sort}&publicName=${publicName}&direction=${direction}`
    );
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<any>(`${environment.ics}/api/roles/${id}`);
  }

  createRole(role: Role): Observable<string> {
    return this.http.post(`${environment.ics}/api/roles`, role).pipe(map((response) => response as string));
  }

  deleteRole(id: string): Observable<Role> {
    return this.http.delete<Role>(`${environment.ics}/api/roles/${id}`, { responseType: 'text' as 'json' });
  }

  editRole(body: RoleEditRequest): Observable<RoleEditResponse> {
    return this.http.post<RoleEditResponse[]>(`${environment.ics}/api/roles/edit`, [body]).pipe(map((responses) => responses[0]));
  }

  importRoles(body: RoleImportRequest[]): Observable<RoleImportResponse[]> {
    return this.http.post<RoleImportResponse[]>(`${environment.ics}/api/roles/import`, body);
  }

  public static getRolePublicName(role: Role) {
    return role.scope + '.role.' + role.name;
  }

  public static generateRoleExportObject(role: Role): object {
    return {
      name: role.name,
      scope: role.scope,
      description: role.description,
      permissions: role.permissions?.map(PermissionsService.generatePermissionExportObject)
    };
  }

  public static generateRoleExportJson(role: Role): string {
    return JSON.stringify(this.generateRoleExportObject(role));
  }
}
