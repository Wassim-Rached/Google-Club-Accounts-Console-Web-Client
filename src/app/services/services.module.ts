import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { authInterceptor } from '../AuthInterceptor';
import { AccountsService } from './accounts/accounts.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AccountsService, AuthService, provideHttpClient(withInterceptors([authInterceptor]))]
})
export class ServicesModule {}
