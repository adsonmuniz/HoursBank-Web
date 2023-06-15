import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankApprovalsComponent } from './bank-approvals.component';

describe('BankApprovalsComponent', () => {
  let component: BankApprovalsComponent;
  let fixture: ComponentFixture<BankApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankApprovalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
