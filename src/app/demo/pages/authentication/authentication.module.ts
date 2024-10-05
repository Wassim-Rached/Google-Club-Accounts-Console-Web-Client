import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthenticationRoutingModule],
  providers: [provideHttpClient()]
})
export class AuthenticationModule {}
