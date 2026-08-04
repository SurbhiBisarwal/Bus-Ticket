import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookingComponent } from './booking.component';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: {
              subscribe: (fn: any) => fn(convertToParamMap({})),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select and deselect seats', () => {
    component.toggleSeat('A1');
    expect(component.selectedSeats).toContain('A1');

    component.toggleSeat('A1');
    expect(component.selectedSeats).not.toContain('A1');
  });

  it('should compute fare from selected seats', () => {
    component.toggleSeat('A1');
    component.toggleSeat('A2');

    expect(component.selectedSeatCount).toBe(2);
    expect(component.totalFare).toBe(2 * component.farePerSeat);
  });
});
