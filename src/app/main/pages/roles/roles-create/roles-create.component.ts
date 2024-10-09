import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SearchGrantRolePermissionComponent } from '../../../components/search-grant-role-permission/search-grant-role-permission.component';
import { Permission } from 'src/app/services/permissions.service';
import { NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles-create',
  standalone: true,
  imports: [SharedModule, SearchGrantRolePermissionComponent, NgbAccordionDirective],
  templateUrl: './roles-create.component.html',
  styleUrl: './roles-create.component.scss'
})
export class RolesCreateComponent implements OnInit {
  @ViewChild(SearchGrantRolePermissionComponent)
  child: SearchGrantRolePermissionComponent;

  formGroup: FormGroup;
  isSubmitting = false;
  scopes = ['global', 'forms', 'cas', 'ics'];
  chosenPermissions: Permission[] = [];
  isPermissionsCollapsed = true;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      scope: ['', Validators.required],
      description: ['', Validators.required],
      permissions: this.fb.array([])
    });
  }

  onSubmit() {
    if (!this.formGroup.valid || this.isSubmitting) return;
    this.formGroup.patchValue({ permissions: this.chosenPermissions });

    const body = this.formGroup.value;
    this.isSubmitting = true;

    this.rolesService.createRole(body).subscribe({
      next: (_) => {
        alert('Permission created successfully');
        this.formGroup.reset();
        this.clearChosenPermissions();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }

  onPermissionChosen(permission: Permission) {
    this.chosenPermissions.push(permission);
  }

  onPermissionUnchosen(permission: Permission) {
    this.chosenPermissions = this.chosenPermissions.filter((p) => p.id !== permission.id);
  }

  clearChosenPermissions() {
    this.chosenPermissions = [];
    this.child.clearChosenPermissions();
  }
}
