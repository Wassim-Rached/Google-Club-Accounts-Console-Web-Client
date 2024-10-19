import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { RequireAuthGuard } from './guards/AuthGuard';
import { RequireUnAuthGuard } from './guards/UnAuthGuard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [RequireAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component')
      },
      {
        path: 'accounts',
        loadChildren: () => import('./main/pages/accounts/accounts.module').then((m) => m.AccountsModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('./main/pages/roles/roles.module').then((m) => m.RolesModule)
      },
      {
        path: 'permissions',
        loadChildren: () => import('./main/pages/permissions/permissions.module').then((m) => m.PermissionsModule)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        canActivate: [RequireUnAuthGuard],
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./main/pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
