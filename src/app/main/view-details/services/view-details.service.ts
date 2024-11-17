import { Injectable } from '@angular/core';
import {
 Firestore,
 arrayUnion,
 deleteField,
 doc,
 docData,
 getDoc,
 updateDoc,
} from '@angular/fire/firestore';
import { AcceptancePendingJob } from '../../home/model/home.structure';
import { ToastService } from 'src/app/shared/services/toast.service';
import { Slot } from '../../select-working-day/models/slot.structure';
import { Booking } from 'src/app/shared/models/booking.structure';
import { FileService } from 'src/app/shared/services/file.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
 providedIn: 'root',
})
export class ViewDetailsService {
 skipButtonTrigger = new BehaviorSubject<{ skip: boolean }>({ skip: false });
 skipButtonClicked = false;
 constructor(
   private firestore: Firestore,
   private toastService: ToastService,
   private fileService: FileService,private router : Router,
 ) {
   this.skipButtonTrigger.subscribe((res:any)=> {this.skipButtonClicked = res.skip})   
  }

 async hapticImpact() {
   await Haptics.impact({ style: ImpactStyle.Medium });
 }

 getBooking(userId: string, id: string) {
   return docData(doc(this.firestore, 'users', userId, 'bookings', id));
 }

 async acceptJob(
   agentId: string,
   customerId: string,
   job: AcceptancePendingJob,
   perDayJob: number,
 ) {
   console.log (agentId, customerId, job, perDayJob);
   // returns the booking update reference
   // start the loading
   let loader = await this.toastService.presentLoading('Accepting the job');
   try {
     // get slot from booking
     let slotDate = moment(job.bookingData.timeSlot?.date.toDate()).format('YYYY-MM-DD');
     console.log('slotDate', slotDate);
     let dateSlot = (
       await getDoc(doc(this.firestore, 'agents', agentId, 'slots', slotDate!))
     ).data() as Slot;
     if (!dateSlot || !dateSlot.working) {
       loader.title = 'Agent is not working on this day';
       await loader.dismiss();
       this.toastService.presentToast('You are not working on this day');
       throw new Error('Agent is not working on this day');
     }
     if (perDayJob <= dateSlot.bookings?.length) {
       loader.title = 'Slot is full';
       await loader.dismiss();
       this.toastService.presentToast('Slot is full');
       throw new Error('Slot is full');
     }
     // sometimes the booking can be undefined
     if (!dateSlot.bookings) {
       dateSlot.bookings = [];
     }
     await updateDoc(
       doc(this.firestore, 'agents', agentId, 'slots', slotDate!),
       {
         bookings: [...dateSlot.bookings!, job.bookingData.id!],
       },
     );
     // change the assignment doc of the booking
     // path :/users/${customerId}/bookings/${job.bookingData.id}/assignments/${job.id}
     if (job.bookingData.id == undefined) {
       throw new Error('Booking id is undefined when accepting the job');
     }
     await updateDoc(
       doc(
         this.firestore,
         'users',
         customerId,
         'bookings',
         job.bookingData.id!,
         'assignments',
         job.id,
       ),
       {
         actionPerformed: true,
         accepted: true,
         acceptanceTime: new Date(),
       },
     );
     // change the assignedAgent of the booking to the current user
     // path :/users/${customerId}/bookings/${job.bookingData.id}
     let updateRequest = await updateDoc(
       doc(
         this.firestore,
         'users',
         customerId,
         'bookings',
         job.bookingData.id!,
       ),
       {
         assignedAgent: agentId,
         stage: 'jobAccepted',
         acceptedAt: new Date(),
       },
     );

     // dismiss the loading
     await loader.dismiss();
     this.hapticImpact();
     // return the update request
     return updateRequest;
   } catch (error) {
     await loader.dismiss();
     throw error;
   }
 }

 async rejectJob(customerId: string, job: AcceptancePendingJob) {
   console.log('booking ', job);

   // returns the booking update reference
   // start the loading
   let loader = await this.toastService.presentLoading('Rejecting the job');
   try {
     // change the assignment doc of the booking
     // path :/users/${customerId}/bookings/${job.bookingData.id}/assignments/${job.id}
     if (job.bookingData.id == undefined) {
       throw new Error('Booking id is undefined when accepting the job');
     }
     console.log(
       "'users', customerId, 'bookings', job.bookingData.id!, 'assignments', job.id",
       'users',
       customerId,
       'bookings',
       job.bookingData.id!,
       'assignments',
       job.id,
     );
     await updateDoc(
       doc(
         this.firestore,
         'users',
         customerId,
         'bookings',
         job.bookingData.id!,
         'assignments',
         job.id,
       ),
       {
         actionPerformed: true,
         accepted: false,
         acceptanceTime: new Date(),
       },
     );

     await updateDoc(
      doc(
        this.firestore,
        'users',
        customerId,
        'bookings',
        job.bookingData.id!,
      ),
      {
        assignedAgent: deleteField(),
        stage: 'allotmentPending',
        acceptedAt: new Date(),
      },
      )
     this.hapticImpact();
     // dismiss the loading
     await loader.dismiss();
   } catch (error) {
     await loader.dismiss();
     throw error;
   }
 }

 async startJob(customerId: string, booking: Booking) {
   let loader = await this.toastService.presentLoading('Starting the job');
   try {
     // change the booking stage to jobStarted
     // path :/users/${customerId}/bookings/${job.bookingData.id}
     if (booking.id == undefined) {
       throw new Error('Booking id is undefined when accepting the job');
     }
     // update the booking
     await updateDoc(
       doc(this.firestore, 'users', customerId, 'bookings', booking.id!),
       {
         stage: 'otpVerificationPending',
         progressAt: new Date(),
       },
     );
     this.hapticImpact();
     // dismiss the loading
     await loader.dismiss();
   } catch (error) {
     await loader.dismiss();
     throw error;
   }
 }

 async validateOtp(customerId: string, booking: Booking, otp: string) {
   let loader = await this.toastService.presentLoading('Validating OTP');
   if (booking?.jobOtp == otp) {
     await updateDoc(
       doc(this.firestore, 'users', customerId, 'bookings', booking.id!),
       {
         stage: 'workStarted',
       },
     );
     // TODO: Notification to the customer
     await loader.dismiss();
     return true;
   } else {
     this.toastService.presentToast('OTP is incorrect');
     await loader.dismiss();
     throw new Error('OTP is incorrect');
   }
 }

 async saveWorkImages(
   customerId: string,
   bookingId: string,
   images: string[],
   stage: 'afterWork' | 'beforeWork',
 ) {
  //  if(this.skipButtonClicked){
  //   return images;
  //  }
   let loader = await this.toastService.presentLoading('Saving images');
   let imageBlobs = await Promise.all(
     images.map((image) =>
       this.fileService.convertDataUrlToFile(
         image,
         `beforeWorkImage_${images.indexOf(image)}.jpg`,
       ),
     ),
   );
   // console.log("imageBlobs",imageBlobs);
   let imageUrls = await Promise.all(
     imageBlobs.map((blob, index) =>
       this.fileService.uploadFile(
         blob,
         `users/${customerId}/bookings/${bookingId}/beforeWorkImages`,
         'before work image',
       ),
     ),
   );
   // console.log("imageUrls",imageUrls);
   if (stage == 'beforeWork') {
     await updateDoc(
       doc(this.firestore, 'users', customerId, 'bookings', bookingId),
       {
         picsBefore: arrayUnion(...imageUrls),
         stage: 'inProgress',
       },
     );
   } else {
     await updateDoc(
       doc(this.firestore, 'users', customerId, 'bookings', bookingId),
       {
         picsAfter: arrayUnion(...imageUrls),
         stage: 'paymentPending',
       },
     );
   }
   await loader.dismiss();
   return imageUrls;
 }

 async completeJob(customerId: string, bookingId: string) {
   let loader = await this.toastService.presentLoading('Completing the job');
   try {
     await updateDoc(
       doc(this.firestore, 'users', customerId, 'bookings', bookingId),
       {
         stage: 'completed',
         completedAt: new Date(),
         paymentRequest: {
           startedAt: new Date(),
           verified: false,
         },
       },
     );
     this.hapticImpact();
     this.toastService.presentToast('Job completed');
     this.router.navigate(['/main/view-details/{{customerId}}/{{bookingId}}/completed']);
     loader.dismiss();
   } catch (error) {
     loader.dismiss();
     throw error;
   }
 }
 async paymentCompleted(customerId: string, bookingId: string) {
  let loader = await this.toastService.presentLoading('Payment completing');
  try {
    await updateDoc(
      doc(this.firestore, 'users', customerId, 'bookings', bookingId),
      {
        stage: 'paymentCompleted',
        paymentRequest: {
          startedAt: new Date(),
          verified: false,
        },
      },
    );
    this.hapticImpact();
    this.toastService.presentToast('Payment completed');
    loader.dismiss();
  } catch (error) {
    loader.dismiss();
    throw error;
  }
}
 async saveRating(customerId: string, booking: Booking, rating: string) {
  let loader = await this.toastService.presentLoading('Rating successfull');
  try {
    await updateDoc(
      doc(this.firestore, 'users', customerId, 'bookings', booking.id!),
      {
        rating: {rating:rating, submittedAt: new Date()}
      },
    );
    // TODO: Notification to the customer
    await loader.dismiss();
    return true;
  } catch (error) {
    loader.dismiss();
    throw error;
  }
}
}
