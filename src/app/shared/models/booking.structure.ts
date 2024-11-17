import { Coupon } from './coupons.structure';
import { natureTax } from './taxes.structure';
import { Address } from './address.structure';
import { Timestamp } from '@angular/fire/firestore';
export interface Booking {
  id?: string;
  subCategory: {
    id: string;
    name: string;
    image: string;
  };
  mainCategory: {
    id: string;
    name: string;
    image: string;
    icon: string;
  };
  services: BillableService[];
  billing: {
    grandTotal: number;
    tax: number;
    discount: number;
    subTotal: number;
    totalJobTime: number;
    totalJobAcceptanceCharge: number;
  };
  createdAt: Timestamp;
  address?: Address;
  jobOtp: string;
  allotmentAt:Timestamp
  timeSlot?: {
    date: Timestamp;
    time: {
      endTime: Timestamp;
      startTime: Timestamp;
    };
  };
  currentUser: {
    userId: string;
    name: string;
    phoneNumber: string;
  };
  payment?: any;
  assignedAgent?: string;
  stage:
    | 'acceptancePending'
    | 'jobAccepted'
    | 'jobStarted'
    | 'otpVerificationPending'
    | 'workStarted'
    | 'inProgress'
    | 'workCompleted'
    | 'paymentPending'
    | 'paymentCompleted'
    | 'completed'
    | 'expired'
    | 'discarded';
  // timings
  acceptedAt?: Timestamp;
  assignedAt?: Timestamp;
  completedAt?: Timestamp;
  progressAt?: Timestamp;
  picsAfter: string[];
  picsBefore: string[];
  cancelReason:string
  // stage monitoring time keys /users/KcOrjTZSkPYefIC5Z1pkLmssPpc2/bookings/ciaSgzCoQAt0CN2Zad6X
}
export interface BillableService {
  quantity: number;
  variants:any[];
  // variant variables
  price: number;
  jobDuration: number;
  description: string;
  jobAcceptanceCharge: number;
  name: string;
  // service variables
  image: string;
  video: string;
  allowReviews: boolean;
  taxes: natureTax[];
  discounts: Coupon[];
  // identifiers
  variantId: string;
  serviceId: string;
  mainCategoryId: string;
  subCategoryId: string;
  billing: {
    originalPrice: number;
    totalPrice: number;
    discount: number;
    discountedPrice: number;
    tax: number;
    untaxedPrice: number;
  };
}
