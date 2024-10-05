import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from '../permissions.service';

export interface Role {
  id: number;
  name: string;
  scope: string;
  permissions?: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get<any>(environment.ics + '/api/roles');
  }

  getRoleById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.ics}/api/roles/${id}`);
  }
}
