import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SearchPermissionsComponent } from '../../../components/search-permissions/search-permissions.component';
import { Permission } from 'src/app/services/permissions.service';
import { NgbAccordionDirective } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-roles-create',
  standalone: true,
  imports: [SharedModule, SearchPermissionsComponent, NgbAccordionDirective],
  templateUrl: './roles-create.component.html',
  styleUrl: './roles-create.component.scss'
})
export class RolesCreateComponent implements OnInit {
  @ViewChild(SearchPermissionsComponent)
  child: SearchPermissionsComponent;

  formGroup: FormGroup;
  isSubmitting = false;
  scopes = ['global', 'forms', 'cas', 'ics'];
  chosenPermissions: Permission[] = [];
  isPermissionsCollapsed = true;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private messagesService: MessagesService
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
      next: (id) => {
        this.toastrService.success('Role created successfully');
        // const permissionDetailsPageLink = `/permissions/details/${id}`;
        const roleDetailsPageLink = `/roles/details/${id}`;
        this.formGroup.reset();
        this.messagesService.pushMessage({
          type: 'success',
          content: 'Role created successfully',
          link: {
            text: 'View Role',
            url: roleDetailsPageLink,
            type: 'internal'
          }
        });
        this.clearChosenPermissions();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error(error);
        let errorMessage = error.error || 'Failed to create permission';
        // if error message is an object get the .error
        if (errorMessage.error) {
          errorMessage = errorMessage.error;
        }
        this.toastrService.error(errorMessage);
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

  hasChosenPermissions() {
    return this.chosenPermissions.length > 0;
  }
}
