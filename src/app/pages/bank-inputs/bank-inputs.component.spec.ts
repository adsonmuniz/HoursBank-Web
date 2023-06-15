import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInputsComponent } from './bank-inputs.component';

describe('BankInputsComponent', () => {
  let component: BankInputsComponent;
  let fixture: ComponentFixture<BankInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankInputsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
