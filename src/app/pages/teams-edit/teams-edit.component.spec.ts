import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsEditComponent } from './teams-edit.component';

describe('TeamsEditComponent', () => {
  let component: TeamsEditComponent;
  let fixture: ComponentFixture<TeamsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
