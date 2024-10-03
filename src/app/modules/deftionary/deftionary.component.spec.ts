import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeftionaryComponent } from './deftionary.component';

describe('DeftionaryComponent', () => {
  let component: DeftionaryComponent;
  let fixture: ComponentFixture<DeftionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeftionaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeftionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
