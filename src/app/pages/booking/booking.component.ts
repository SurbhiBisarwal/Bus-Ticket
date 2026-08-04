import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService, BookingRecord } from '../../services/booking.service';

interface PassengerInfo {
  name: string;
  age: string | number;
  gender: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent {
  farePerSeat = 780;
  selectedSeats: string[] = [];
  passengers: PassengerInfo[] = [{ name: '', age: '', gender: 'Male' }];
  seatLayout = Array.from({ length: 6 }, (_, row) =>
    Array.from(
      { length: 4 },
      (_, col) => `${String.fromCharCode(65 + row)}${col + 1}`,
    ),
  );
  bookedSeats = ['A2', 'B3', 'C1', 'D4'];
  boardingPoint = 'M.G. Road';
  droppingPoint = 'Electronic City';
  paymentMethod = 'UPI';
  travellerName = '';
  travellerMobile = '';
  email = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private bookingService: BookingService,
  ) {}

  goBack(): void {
    this.router.navigate(['/search']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/search']);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const operator = params.get('operator') ?? 'Premium Travels';
      const departure = params.get('departure') ?? '22:30';
      const arrival = params.get('arrival') ?? '06:15';
      const price = params.get('price') ?? '780';
      this.farePerSeat = Number(price);
      this.travellerName = operator;
      this.travellerMobile = departure;
      this.email = arrival;
    });
  }

  get selectedSeatCount(): number {
    return this.selectedSeats.length;
  }

  get totalFare(): number {
    return this.selectedSeatCount * this.farePerSeat;
  }

  get isSeatSelectionComplete(): boolean {
    return (
      this.selectedSeatCount > 0 &&
      this.passengers.every(
        (p) => p.name.trim().length > 0 && String(p.age).trim().length > 0,
      )
    );
  }

  toggleSeat(seat: string): void {
    if (this.bookedSeats.includes(seat)) {
      return;
    }

    this.selectedSeats = this.selectedSeats.includes(seat)
      ? this.selectedSeats.filter((item) => item !== seat)
      : [...this.selectedSeats, seat];

    if (this.selectedSeatCount > this.passengers.length) {
      this.passengers.push({ name: '', age: '', gender: 'Male' });
    }
  }

  addPassenger(): void {
    this.passengers.push({ name: '', age: '', gender: 'Male' });
  }

  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.splice(index, 1);
    }
  }

  confirmBooking(): void {
    if (!this.isSeatSelectionComplete) {
      return;
    }

    const user = this.authService.currentUser;
    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { redirectUrl: '/booking' },
      });
      return;
    }

    const booking: BookingRecord = {
      id: `${Date.now()}`,
      user,
      operator: this.travellerName || 'Premium Travels',
      departure: this.travellerMobile || '22:30',
      arrival: this.email || '06:15',
      price: this.farePerSeat,
      seats: [...this.selectedSeats],
      total: this.totalFare,
      createdAt: new Date().toLocaleString(),
    };

    this.bookingService.addBooking(booking);
    this.router.navigate(['/my-bookings']);
  }
}
