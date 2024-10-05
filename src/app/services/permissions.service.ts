import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Permission {
  id: string;
  name: string;
  scope: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any> {
    return this.http.get<any>(environment.ics + '/api/permissions');
  }
}
