import { Pipe, PipeTransform } from '@angular/core';
import { Permission, PermissionsService } from 'src/app/services/permissions.service';

@Pipe({
  name: 'permissionPublicName',
  standalone: true
})
export class PermissionPublicNamePipe implements PipeTransform {
  transform(permission: Permission, ...args: unknown[]): unknown {
    return PermissionsService.getPermissionPublicName(permission);
  }
}
