import { Component, OnInit } from '@angular/core';
import { Account, AccountsService } from 'src/app/services/accounts/accounts.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-list-accounts',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-accounts.component.html',
  styleUrl: './list-accounts.component.scss'
})
export class ListAccountsComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.accountsService.getAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
