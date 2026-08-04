# Bus Ticket App — Interview Guide

## Project Overview

A bus booking application built with Angular 19 that mimics the Redbus booking experience.

Core capabilities:

- Search and filter bus routes by source and destination
- Login-protected booking and booking history pages
- Seat selection and passenger detail collection
- Local storage persistence for user session and bookings
- Booking cancellation from the user booking history
- Responsive UI with a Redbus-inspired homepage and search layout

## Tech Stack

- Angular 19
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- LocalStorage for persistence
- FontAwesome icons + Bootstrap utility styles

## High-Level Architecture

- `src/app/app.routes.ts`: Defines the main routes
  - `/search` for route discovery
  - `/booking` for seat selection and confirmation
  - `/login` for authentication
  - `/my-bookings` for user booking history
- `AuthGuard` protects `/booking` and `/my-bookings`
- `AuthService` manages login state and current user
- `BookingService` centralizes booking data, persistence, and cancellation

## Component Breakdown

### `SearchComponent`

- Displays the homepage, search form, banner, and bus list
- Uses a local hard-coded `buses` array with route data
- Filters buses using `searchFrom` and `searchTo`
- Supports a logged-in profile dropdown with `My bookings` and `Logout`
- Navigates to `/booking` with selected bus query params

### `BookingComponent`

- Shows seat layout and passenger detail form
- Keeps `selectedSeats` and `passengers` arrays
- Uses computed getters:
  - `selectedSeatCount`
  - `totalFare`
  - `isSeatSelectionComplete`
- Only enables confirmation once seats are selected and passenger name/age are filled
- Saves booking through `BookingService.addBooking()`
- Redirects to `/my-bookings` after successful booking

### `LoginComponent`

- Performs simple validation on username and password
- Persists the logged-in user in localStorage via `AuthService`
- Supports redirecting back to protected routes after login

### `MyBookingsComponent`

- Shows current user bookings filtered by `BookingService.getBookingsForUser()`
- Includes a cancel booking button to remove a booking
- Updates automatically through RxJS `BehaviorSubject`

## State and Persistence

- `AuthService` holds login state in a `BehaviorSubject`
- `currentUser` is stored in localStorage at key `busAppUser`
- `BookingService` persists bookings in localStorage at key `busAppBookings`
- `BehaviorSubject` ensures UI updates when bookings change

## Authentication Flow

- User logs in through `/login`
- `AuthGuard` checks `AuthService.isLoggedIn`
- Unauthenticated users who hit protected routes are redirected to login with `redirectUrl`
- Once logged in, the user can access `/booking` and `/my-bookings`

## Booking Flow

1. User searches routes on `/search`
2. User clicks `Book now` for a bus
3. App navigates to `/booking` with query params
4. User selects seats and fills passenger data
5. `Confirm booking` becomes enabled only when validation passes
6. Booking is saved and user is sent to `/my-bookings`

## Cancellation Flow

- Each booking card has a `Cancel booking` button
- Clicking it calls `BookingService.cancelBooking(booking.id)`
- Cancelled bookings are removed from localStorage and from the UI

## Key Implementation Decisions

- **Route protection** with `AuthGuard` keeps booking and history private
- **LocalStorage** gives a lightweight persistence layer without backend
- **Reactive state** with `BehaviorSubject` ensures components update automatically
- **Standalone components** keep imports explicit and avoid module boilerplate
- **Search filtering** is implemented with simple string matching for responsiveness

## How to Explain in Interview

- Describe the main user journey: search → login/account check → book → confirm → view history
- Mention how you handled protected routes and redirect logic
- Explain why you chose local storage for persistence in a demo app
- Highlight UI decisions like the profile dropdown, confirm button activation, and cancel booking flow
- Be ready to discuss how you would extend the app with a backend API or real seat availability

## Possible Improvements

- Add a real backend API for authentication and booking persistence
- Replace hard-coded bus data with an external service
- Add better form validation and error messages
- Support a date picker and route availability by date
- Add unit tests for components and services
- Make the seat selection layout more realistic with cabin rows and window/aisle labels

## Talking Points for Strength

- You used Angular best practices like services for logic and guards for protection
- The app shows both UI polish and business logic flow
- You handled state persistence, dynamic filters, and reactive updates
- You can describe how you separated responsibilities across components and services
