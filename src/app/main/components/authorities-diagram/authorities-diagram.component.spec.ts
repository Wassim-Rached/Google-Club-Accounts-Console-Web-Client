import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritiesDiagramComponent } from './authorities-diagram.component';

describe('AuthoritiesDiagramComponent', () => {
  let component: AuthoritiesDiagramComponent;
  let fixture: ComponentFixture<AuthoritiesDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoritiesDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthoritiesDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
