import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account, AccountsService } from 'src/app/services/accounts/accounts.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Page } from 'src/types';

@Component({
  selector: 'app-list-accounts',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './list-accounts.component.html',
  styleUrl: './list-accounts.component.scss'
})
export class ListAccountsComponent implements OnInit {
  accounts?: Page<Account>;
  defaultPhotoUrl = 'assets/images/user/avatar-2.jpg';
  searchTimeoutId?: number;
  currentPage: number = 0;
  currentSortTerm: string = 'email';
  currentSortDirection: string = 'asc';

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    this.searchAccounts();
  }

  searchAccounts(email: string = '', applyWait: boolean = false): void {
    if (applyWait) {
      if (this.searchTimeoutId) {
        clearTimeout(this.searchTimeoutId);
      }
      this.searchTimeoutId = window.setTimeout(() => {
        this.executeSearch(email);
      }, 800);
    } else {
      this.executeSearch(email);
    }
  }

  private executeSearch(email: string): void {
    const page = this.currentPage;
    const size = 5;
    const sort = this.currentSortTerm;
    const direction = this.currentSortDirection;
    this.accounts = undefined;
    this.accountsService.searchAccounts(page, size, sort, direction, email).subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error) => {
        console.error(error);
        this.accounts = null;
      }
    });
  }

  sortAccounts(sort: string): void {
    const [currentSortTerm, currentSortDirection] = sort.split(',');
    this.currentSortTerm = currentSortTerm;
    this.currentSortDirection = currentSortDirection;
    this.searchAccounts();
  }

  searchNextAccountsPage() {
    this.currentPage++;
    this.searchAccounts();
  }

  searchPreviousAccountsPage() {
    this.currentPage--;
    this.searchAccounts();
  }

  searchAccountsPage(page: number) {
    this.currentPage = page;
    this.searchAccounts();
  }

  public get accountsHasNextPage() {
    return this.accounts && this.accounts.page.totalPages > this.currentPage + 1;
  }

  public get accountsHasPreviousPage() {
    return this.accounts && this.currentPage > 0;
  }
}
