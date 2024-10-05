import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Permission } from 'src/app/services/permissions.service';
import { Role, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-roles-details',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './roles-details.component.html',
  styleUrl: './roles-details.component.scss'
})
export class RolesDetailsComponent implements OnInit {
  role: Role;

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // get roleId from route params
    const roleId = this.route.snapshot.params['id'];

    this.rolesService.getRoles().subscribe({
      next: (response) => {
        const roles = response.data;
        this.role = roles.find((role) => role.id === roleId);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addPermission() {
    throw new Error('Method not implemented.');
  }
  removePermission(_t16: Permission) {
    throw new Error('Method not implemented.');
  }
}
