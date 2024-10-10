import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(`${environment.ics}/api/permissions`, permission);
  }

  deletePermission(id: string): Observable<Permission> {
    return this.http.delete<Permission>(`${environment.ics}/api/permissions/${id}`);
  }

  public static getPermissionPublicName(permission: Permission) {
    return permission.scope + '.perm.' + permission.name;
  }
}
