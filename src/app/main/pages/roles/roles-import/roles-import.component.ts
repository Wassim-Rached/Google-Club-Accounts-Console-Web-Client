import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Authorities, AuthoritiesDiagramComponent } from '../../../components/authorities-diagram/authorities-diagram.component';
import { RoleImportRequest, RoleImportResponse, RolesService } from 'src/app/services/roles/roles.service';
import { PermissionImportRequest } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-roles-import',
  standalone: true,
  imports: [SharedModule, AuthoritiesDiagramComponent],
  templateUrl: './roles-import.component.html',
  styleUrls: ['./roles-import.component.scss']
})
export class RolesImportComponent implements OnInit {
  formGroup: FormGroup;
  selectedFiles: File[] = [];
  isSubmitting = false;
  authorities: Authorities | null = null;
  show: boolean = false;
  roleImportResponses: RoleImportResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({});
  }

  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.push(...Array.from(input.files));
      this.authorities = await this.getAuthorities();
    }
  }

  async removeFile(index: number): Promise<void> {
    this.selectedFiles.splice(index, 1);
    this.authorities = await this.getAuthorities();
  }

  loadFiles(): Promise<any[]> {
    const fileReaders = this.selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            resolve(JSON.parse(e.target.result));
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    });

    return Promise.all(fileReaders);
  }

  async onSubmit() {
    if (!this.formGroup.valid) return;
    if (this.selectedFiles.length === 0) return;

    this.isSubmitting = true;

    const files = await this.getRolesFilesJsonArray();

    // process the files
    const body: RoleImportRequest[] = [];
    for (const file of files) {
      const permissions: PermissionImportRequest[] = file.permissions.map((permission) => {
        return {
          name: permission.name,
          scope: permission.scope,
          description: permission.description
        };
      });
      body.push({
        name: file.name,
        description: file.description,
        scope: file.scope,
        permissions: permissions
      });
    }

    this.rolesService.importRoles(body).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.roleImportResponses = response;
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error(error);
      }
    });
  }

  resetInputs() {
    this.selectedFiles = [];
    this.authorities = null;
    this.roleImportResponses = [];
    this.formGroup.reset();
  }

  async getRolesFilesJsonArray(): Promise<any[]> {
    const jsonArray: any[] = [];
    const fileReaders = this.selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const json = JSON.parse(e.target.result);
            jsonArray.push(json);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    });

    await Promise.all(fileReaders);
    return jsonArray;
  }

  async getAuthorities(): Promise<Authorities | null> {
    const a = await this.getRolesFilesJsonArray();
    const roles: Authorities['roles'] = a.map((role) => {
      const permissions: Authorities['roles'][0]['permissions'] = role.permissions.map((permission) => {
        return {
          name: permission.name,
          scope: permission.scope
        };
      });
      return {
        name: role.name,
        scope: role.scope,
        permissions: permissions
      };
    });
    return {
      email: 'to be imported',
      roles: roles,
      permissions: []
    };
  }
}
