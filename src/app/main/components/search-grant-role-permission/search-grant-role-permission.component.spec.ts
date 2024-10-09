import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGrantRolePermissionComponent } from './search-grant-role-permission.component';

describe('SearchGrantRolePermissionComponent', () => {
  let component: SearchGrantRolePermissionComponent;
  let fixture: ComponentFixture<SearchGrantRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGrantRolePermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchGrantRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
