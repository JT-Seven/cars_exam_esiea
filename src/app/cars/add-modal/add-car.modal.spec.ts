import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCarModal } from './add-car.modal';

describe('AddCarModal', () => {
  let component: AddCarModal;
  let fixture: ComponentFixture<AddCarModal>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
