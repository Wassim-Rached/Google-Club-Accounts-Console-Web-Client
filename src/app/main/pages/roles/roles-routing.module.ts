import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./roles-list/roles-list.component').then((m) => m.RolesListComponent)
      },
      {
        // details
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
