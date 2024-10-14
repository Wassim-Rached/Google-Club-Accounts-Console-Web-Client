import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
    private toastrService: ToastrService
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
      next: (_) => {
        this.toastrService.success('Permission created successfully');
        this.formGroup.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error('Failed to create permission');
        this.isSubmitting = false;
      }
    });
  }
}
