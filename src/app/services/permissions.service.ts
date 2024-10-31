import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from './accounts/accounts.service';
import { Role } from './roles/roles.service';
import { Page } from 'src/types';

export interface Permission {
  id: string;
  name: string;
  scope: string;
  description?: string;
  roles?: Role[];
  accounts?: Account[];
}

export interface PermissionImportRequest {
  name: string;
  scope: string;
  description: string;
}

export interface PermissionImportResponse {
  permissionPublicName: string;
  status: 'created' | 'skipped';
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private http: HttpClient) {}

  searchPermissions(
    page: number = 0,
    size: number = 10,
    sort: string = 'scope',
    direction = 'asc',
    publicName: string = ''
  ): Observable<Page<Permission>> {
    return this.http.get<Page<Permission>>(
      `${environment.ics}/api/permissions?page=${page}&size=${size}&sort=${sort}&publicName=${publicName}&direction=${direction}`
    );
  }

  getPermissionById(id: string): Observable<Permission> {
    return this.http.get<Permission>(`${environment.ics}/api/permissions/${id}`);
  }

  createPermission(permission: Permission): Observable<string> {
    return this.http.post(`${environment.ics}/api/permissions`, permission).pipe(map((response) => response as string));
  }

  deletePermission(id: string): Observable<string> {
    return this.http.delete(`${environment.ics}/api/permissions/${id}`).pipe(map((response) => response as string));
  }

  public static getPermissionPublicName(permission: Permission) {
    return permission.scope + '.perm.' + permission.name;
  }

  public static generatePermissionExportObject(permission: Permission): object {
    return {
      name: permission.name,
      scope: permission.scope,
      description: permission.description
    };
  }

  public static generatePermissionExportJson(permission: Permission): string {
    return JSON.stringify(this.generatePermissionExportObject(permission));
  }
}
