import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentDetailsComponent } from './add-payment-details.component';

describe('AddPaymentDetailsComponent', () => {
  let component: AddPaymentDetailsComponent;
  let fixture: ComponentFixture<AddPaymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPaymentDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
