import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';

interface App {
  name: string;
  url: string;
  abbreviation?: string;
  authorities?: Authority[];
}

interface Authority {
  id?: string;
  publicName: string;
}

@Component({
  selector: 'app-authorities',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './authorities.component.html',
  styleUrl: './authorities.component.scss'
})
export class AuthoritiesComponent implements OnInit {
  apps: App[];
  allAuthorities: Authority[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.apps = environment.apps;
    this.fetchAllAuthorities();
  }

  fetchAllAuthorities(): void {
    let processedApps = 0;
    const totalApps = this.apps.length;
    this.apps.forEach((app: App) => {
      this.httpClient.get(app.url + '/api/authorities').subscribe((authorities: string[]) => {
        app.authorities = authorities.map((authority: string) => ({ publicName: authority }));
        this.allAuthorities = this.allAuthorities.concat(app.authorities);
        processedApps++;
        if (processedApps === totalApps) {
          console.log('all authorities', this.allAuthorities);
          console.log('apps', this.apps);
          this.fetchAndVerifAuthorities();
        }
      });
    });
  }

  fetchAndVerifAuthorities(): void {
    console.log('fetchAndVerifAuthorities');
    console.log('all authorities', this.allAuthorities);
    this.httpClient
      .post<{ [key: string]: string }>(
        environment.ics + '/api/authorities',
        this.allAuthorities.map((a) => a.publicName)
      )
      .subscribe((authorityMap: { [key: string]: string }) => {
        console.log({ authorityMap });
        this.allAuthorities = Object.keys(authorityMap).map((key) => ({
          id: key,
          publicName: authorityMap[key]
        }));
        this.apps.forEach((app) => {
          app.authorities.forEach((authority) => {
            const foundAuthority = this.allAuthorities.find((a) => a.publicName === authority.publicName);
            if (foundAuthority) {
              authority.id = foundAuthority.id;
            }
          });
        });
      });
  }

  getAuthorityLink(authority: Authority): string {
    const type = this.authorityType(authority);
    return '/' + type + 's/details/' + authority.id;
  }

  authorityType(authority: Authority): 'permission' | 'role' | '' {
    // determine if its a perm or role format : {scope}.{'perm'|'role'}.{name}
    const parts = authority.publicName.split('.');
    if (parts.length !== 3) {
      return '';
    }
    const type = parts[1] === 'perm' ? 'permission' : 'role';
    return type;
  }
}
