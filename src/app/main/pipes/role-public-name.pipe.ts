import { Pipe, PipeTransform } from '@angular/core';
import { Role, RolesService } from 'src/app/services/roles/roles.service';

@Pipe({
  name: 'rolePublicName',
  standalone: true
})
export class RolePublicNamePipe implements PipeTransform {
  transform(role: Role, ...args: unknown[]): unknown {
    return RolesService.getRolePublicName(role);
  }
}
