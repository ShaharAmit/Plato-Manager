import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersPredComponent } from './customers-pred.component';

describe('CustomersPredComponent', () => {
  let component: CustomersPredComponent;
  let fixture: ComponentFixture<CustomersPredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersPredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersPredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
