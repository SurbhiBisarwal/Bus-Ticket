import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingService, BookingRecord } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent {
  bookings: BookingRecord[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.bookingService
      .getBookingsForUser(this.authService.currentUser)
      .subscribe((bookings) => {
        this.bookings = bookings;
      });
  }

  cancelBooking(bookingId: string): void {
    this.bookingService.cancelBooking(bookingId);
  }
}
