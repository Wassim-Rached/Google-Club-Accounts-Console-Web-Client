import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {
  formGroup: FormGroup;
  isSubmitting = false;
  redirect: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
    this.redirect = this.route.snapshot.queryParams['redirect'] || '/';
  }

  onSubmit(): void {
    if (!this.formGroup.valid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.authService.login(this.formGroup.value).subscribe({
      next: (_) => {
        this.isSubmitting = false;

        // redirect to 'redirect'
        this.router.navigate([this.redirect]);
      },
      error: (error) => {
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
}
