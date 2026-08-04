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
