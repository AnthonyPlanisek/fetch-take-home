import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogLandingPageComponent } from './dog-landing-page.component';

describe('DogLandingPageComponent', () => {
  let component: DogLandingPageComponent;
  let fixture: ComponentFixture<DogLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogLandingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
