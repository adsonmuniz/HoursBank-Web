import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInputComponent } from './bank-input.component';

describe('BankInputComponent', () => {
  let component: BankInputComponent;
  let fixture: ComponentFixture<BankInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
