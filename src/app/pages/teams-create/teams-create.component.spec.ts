import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsCreateComponent } from './teams-create.component';

describe('TeamsCreateComponent', () => {
  let component: TeamsCreateComponent;
  let fixture: ComponentFixture<TeamsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
