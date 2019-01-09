import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradorScriptsComponent } from './generador-scripts.component';

describe('GeneradorScriptsComponent', () => {
  let component: GeneradorScriptsComponent;
  let fixture: ComponentFixture<GeneradorScriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneradorScriptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneradorScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
