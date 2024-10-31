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
        loadComponent: () => import('./roles-list/roles-list.component').then((m) => m.RolesListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./roles-create/roles-create.component').then((m) => m.RolesCreateComponent)
      },
      {
        path: 'import',
        loadComponent: () => import('./roles-import/roles-import.component').then((m) => m.RolesImportComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./roles-details/roles-details.component').then((m) => m.RolesDetailsComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
