import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNativeSelectComponent } from './form-native-select.component';

describe('FormNativeSelectComponent', () => {
  let component: FormNativeSelectComponent;
  let fixture: ComponentFixture<FormNativeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNativeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNativeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
