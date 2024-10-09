import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        loadComponent: () => import('./permissions-list/permissions-list.component').then((m) => m.PermissionsListComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./permissions-details/permissions-details.component').then((m) => m.PermissionsDetailsComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./permissions-create/permissions-create.component').then((m) => m.PermissionsCreateComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule {}
