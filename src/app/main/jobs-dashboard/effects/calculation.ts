import { Booking } from 'src/app/shared/models/booking.structure';

export function calculateTotalEarning(bookings: Booking[]) {
  let totalEarning = bookings
    .map((booking) => booking.billing.grandTotal)
    .reduce((b, a) => b + a);
  return totalEarning;
}
export function calculateTotalDeduction(bookings: Booking[]) {
  let totalDeduction = bookings
    .map((booking) => booking.billing.totalJobAcceptanceCharge)
    .reduce((b, a) => b + a);
  return totalDeduction;
}
export function calculateNetEarning(bookings: Booking[]) {
  let netEarning =
    calculateTotalEarning(bookings) - calculateTotalDeduction(bookings);
  return netEarning;
}
