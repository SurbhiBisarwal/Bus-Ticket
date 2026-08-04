import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'busAppUser';
  private userSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this.storageKey),
  );
  user$ = this.userSubject.asObservable();

  get isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  get currentUser(): string | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): boolean {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password.trim()) {
      return false;
    }

    localStorage.setItem(this.storageKey, trimmedUsername);
    this.userSubject.next(trimmedUsername);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }
}
