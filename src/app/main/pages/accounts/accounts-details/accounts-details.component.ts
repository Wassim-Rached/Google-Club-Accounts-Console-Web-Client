import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Account, AccountsService } from 'src/app/services/accounts/accounts.service';
import { Permission } from 'src/app/services/permissions.service';
import { Role } from 'src/app/services/roles/roles.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-accounts-details',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './accounts-details.component.html',
  styleUrl: './accounts-details.component.scss'
})
export class AccountsDetailsComponent implements OnInit {
  isCollapsedRole = true;
  saveChanges() {
    throw new Error('Method not implemented.');
  }
  revokePermission(_t80: Permission) {
    throw new Error('Method not implemented.');
  }
  grantPermission() {
    throw new Error('Method not implemented.');
  }
  revokeRole(_t41: Role) {
    throw new Error('Method not implemented.');
  }
  grantRole() {
    throw new Error('Method not implemented.');
  }
  account?: Account;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.params['id'];
    this.accountsService.getAccountById(accountId).subscribe({
      next: (account) => {
        this.account = account;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
