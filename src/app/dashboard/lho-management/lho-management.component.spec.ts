import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LhoManagementComponent } from './lho-management.component';

describe('LhoManagementComponent', () => {
  let component: LhoManagementComponent;
  let fixture: ComponentFixture<LhoManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LhoManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LhoManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
