import { Component, OnInit } from '@angular/core';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-permissions-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss'
})
export class PermissionsListComponent implements OnInit {
  permissions: Permission[] = [];

  constructor(private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.permissionsService.getPermissions().subscribe({
      next: (response) => {
        this.permissions = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
