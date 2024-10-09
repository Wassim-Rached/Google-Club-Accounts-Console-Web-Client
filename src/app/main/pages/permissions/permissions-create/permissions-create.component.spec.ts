import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsCreateComponent } from './permissions-create.component';

describe('PermissionsCreateComponent', () => {
  let component: PermissionsCreateComponent;
  let fixture: ComponentFixture<PermissionsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
