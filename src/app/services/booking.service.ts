import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BookingRecord {
  id: string;
  user: string;
  operator: string;
  departure: string;
  arrival: string;
  price: number;
  seats: string[];
  total: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly storageKey = 'busAppBookings';
  private bookingSubject = new BehaviorSubject<BookingRecord[]>(
    this.loadBookings(),
  );
  bookings$ = this.bookingSubject.asObservable();

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.bookingSubject.next(this.loadBookings());
      }
    });
  }

  private loadBookings(): BookingRecord[] {
    try {
      return JSON.parse(
        localStorage.getItem(this.storageKey) ?? '[]',
      ) as BookingRecord[];
    } catch {
      return [];
    }
  }

  private saveBookings(bookings: BookingRecord[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
    this.bookingSubject.next(bookings);
  }

  addBooking(record: BookingRecord): void {
    const current = this.bookingSubject.value;
    this.saveBookings([record, ...current]);
  }

  getBookedSeats(): string[] {
    return Array.from(
      new Set(this.bookingSubject.value.flatMap((booking) => booking.seats)),
    );
  }

  getUnavailableSeats(seats: string[]): string[] {
    const booked = new Set(this.getBookedSeats());
    return seats.filter((seat) => booked.has(seat));
  }

  cancelBooking(bookingId: string): void {
    const updated = this.bookingSubject.value.filter(
      (booking) => booking.id !== bookingId,
    );
    this.saveBookings(updated);
  }

  getBookingsForUser(user: string | null): Observable<BookingRecord[]> {
    return this.bookings$.pipe(
      map((bookings) => bookings.filter((booking) => booking.user === user)),
    );
  }
}
