import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountGrantRoleComponent } from './search-account-grant-role.component';

describe('SearchAccountGrantRoleComponent', () => {
  let component: SearchAccountGrantRoleComponent;
  let fixture: ComponentFixture<SearchAccountGrantRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAccountGrantRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAccountGrantRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
