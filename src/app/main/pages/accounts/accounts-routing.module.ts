import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./list-accounts/list-accounts.component').then((m) => m.ListAccountsComponent)
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./accounts-details/accounts-details.component').then((m) => m.AccountsDetailsComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
