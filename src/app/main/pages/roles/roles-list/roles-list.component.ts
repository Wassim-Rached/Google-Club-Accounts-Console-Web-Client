import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role, RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
