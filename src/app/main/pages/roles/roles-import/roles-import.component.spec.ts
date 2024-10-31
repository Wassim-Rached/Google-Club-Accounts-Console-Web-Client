import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesImportComponent } from './roles-import.component';

describe('RolesImportComponent', () => {
  let component: RolesImportComponent;
  let fixture: ComponentFixture<RolesImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
