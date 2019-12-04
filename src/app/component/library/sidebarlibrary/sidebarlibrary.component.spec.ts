import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarlibraryComponent } from './sidebarlibrary.component';

describe('SidebarlibraryComponent', () => {
  let component: SidebarlibraryComponent;
  let fixture: ComponentFixture<SidebarlibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarlibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarlibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
