import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotFoundComponent } from '../../not-found/not-found.component';

@Component({
  selector: 'app-permissions-details',
  standalone: true,
  imports: [SharedModule, RouterModule, NotFoundComponent],
  templateUrl: './permissions-details.component.html',
  styleUrl: './permissions-details.component.scss'
})
export class PermissionsDetailsComponent implements OnInit {
  defaultPhotoUrl: any;
  permission?: Permission;

  constructor(
    private permissionsService: PermissionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const permissionId = this.route.snapshot.params['id'];
    this.permissionsService.getPermissionById(permissionId).subscribe({
      next: (permission) => {
        this.permission = permission;
      },
      error: (error) => {
        if (error.status === 404) {
          this.permission = null;
        } else {
          console.error(error);
        }
      }
    });
  }

  deletePermission() {
    if (!this.permission) return;
    const confirmation = confirm(
      'Are you sure you want to delete this permission? All related relations with accounts and roles for this permission will be lost.'
    );
    if (confirmation) {
      const permissionId = this.route.snapshot.params['id'];
      this.permissionsService.deletePermission(permissionId).subscribe({
        next: () => {
          alert('Permission deleted successfully');
          this.router.navigate(['/permissions']);
        },
        error: (error) => {
          console.error(error);
          alert('Failed to delete permission');
        }
      });
    }
  }
}
