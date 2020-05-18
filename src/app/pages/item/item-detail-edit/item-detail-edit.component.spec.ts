import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailEditComponent } from './item-detail-edit.component';

describe('ItemDetailEditComponent', () => {
  let component: ItemDetailEditComponent;
  let fixture: ComponentFixture<ItemDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
