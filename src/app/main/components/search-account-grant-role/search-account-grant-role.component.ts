import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Account, AccountsService } from 'src/app/services/accounts/accounts.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-search-account-grant-role',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './search-account-grant-role.component.html',
  styleUrl: './search-account-grant-role.component.scss'
})
export class SearchAccountGrantRoleComponent implements OnInit {
  accounts?: Page<Account>;
  chosenAccounts: Account[] = [];
  searchTimeoutId?: number;
  @Output() accountChosen = new EventEmitter<Account>();
  @Output() accountUnchosen = new EventEmitter<Account>();

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.refreshaccounts();
  }

  refreshaccounts(email: string = '') {
    if (this.searchTimeoutId) {
      clearTimeout(this.searchTimeoutId);
    }

    if (email === null || email === undefined || email === '') {
      this.accounts = { content: [], page: { size: 5, totalElements: 0, totalPages: 0, number: 0 } };
      return;
    }

    this.searchTimeoutId = window.setTimeout(() => {
      const page = 0;
      const size = 5;
      const sort = 'email';
      const direction = 'asc';
      this.accounts = undefined;
      this.accountsService.searchAccounts(page, size, sort, direction, email).subscribe({
        next: (accounts) => {
          this.accounts = accounts;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }, 300);
  }

  haveBeenChosen(account: Account) {
    return this.chosenAccounts.filter((p) => p.id === account.id).length > 0;
  }

  choseaccount(account: Account) {
    if (!this.accounts || !this.accounts.content) return;
    this.chosenAccounts.push(account);
    this.accountChosen.emit(account);
  }

  unchoseaccount(account: Account) {
    if (!this.accounts || !this.accounts.content) return;
    this.chosenAccounts = this.chosenAccounts.filter((p) => p.id !== account.id);
    this.accountUnchosen.emit(account);
  }

  public clearChosenaccounts() {
    this.chosenAccounts = [];
  }
}
