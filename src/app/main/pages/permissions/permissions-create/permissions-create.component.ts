import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessagesService } from 'src/app/services/messages.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-permissions-create',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './permissions-create.component.html',
  styleUrl: './permissions-create.component.scss'
})
export class PermissionsCreateComponent implements OnInit {
  formGroup: FormGroup;
  isSubmitting = false;
  scopes = ['global', 'forms', 'cas', 'ics'];

  constructor(
    private permissionsService: PermissionsService,
    private toastrService: ToastrService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      scope: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (!this.formGroup.valid || this.isSubmitting) return;

    const body = this.formGroup.value;

    this.isSubmitting = true;

    this.permissionsService.createPermission(body).subscribe({
      next: (id) => {
        this.toastrService.success('Permission created successfully');
        const permissionDetailsPageLink = `/permissions/details/${id}`;
        this.messagesService.pushMessage({
          type: 'success',
          content: 'Permission created successfully',
          link: {
            text: 'View Permission',
            url: permissionDetailsPageLink,
            type: 'internal'
          }
        });
        this.formGroup.reset();
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
}
