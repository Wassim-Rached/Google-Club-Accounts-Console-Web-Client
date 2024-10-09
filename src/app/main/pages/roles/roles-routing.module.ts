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
        // details
        path: 'details/:id',
        loadComponent: () => import('./roles-details/roles-details.component').then((m) => m.RolesDetailsComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./roles-create/roles-create.component').then((m) => m.RolesCreateComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
