import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeQuestionsComponent } from './make-questions.component';

describe('MakeQuestionsComponent', () => {
  let component: MakeQuestionsComponent;
  let fixture: ComponentFixture<MakeQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
