import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictionaryComponent } from './pictionary.component';

describe('PictionaryComponent', () => {
  let component: PictionaryComponent;
  let fixture: ComponentFixture<PictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PictionaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
