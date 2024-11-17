import { Injectable } from '@angular/core';
import {
  Firestore,
  GeoPoint,
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  Category,
  SubCategory,
} from 'src/app/shared/models/category.structure';
import { FileService } from 'src/app/shared/services/file.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PendingUser } from '../models/signup.structure';
import { AuthUserReadOnly } from 'src/app/shared/models/app.structure';
import { Agent } from 'src/app/shared/models/agent.structure';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import { SlotService } from 'src/app/main/select-working-day/services/slot.service';
import { TimeSlot } from '../../../main/select-working-day/models/select-working-day.structure';
import { Slot } from 'src/app/main/select-working-day/models/slot.structure';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(
    private firestore: Firestore,
    private toastService: ToastService,
    private fileService: FileService,
    private slotService: SlotService,
    private notificationService: NotificationsService,
  ) {}

  async loadServiceCatalogue1(areaId: string) {
    console.log('service-catalogue', areaId, 'categories');
    let enabledMainCategories = await getDocs(
      query(
        collection(this.firestore, 'service-catalogue', areaId, 'categories'),
        where('enabled', '==', true),
      ),
    );
    return await Promise.all(
      enabledMainCategories.docs.map(async (mainCategory) => {
        console.log(
          'service-catalogue',
          areaId,
          'categories',
          mainCategory.id,
          'categories',
        );
        let enabledSubCategories = await getDocs(
          query(
            collection(
              this.firestore,
              'service-catalogue',
              areaId,
              'categories',
              mainCategory.id,
              'categories',
            ),
            where('enabled', '==', true),
          ),
        );
        return {
          ...mainCategory.data(),
          id: mainCategory.id,
          subCategories: enabledSubCategories.docs.map((subCategory) => {
            return {...subCategory.data(), id: subCategory.id } as SubCategory;
          }),
        } as Category;
      }),
    );
  }
  async loadServiceCatalogue(stateId: string, cityId: string) {
    try {
      const allActiveAreasSnapshot = await getDocs(
        query(
          collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),
          where('active', '==', true),
        ),
      );
      const areasData = await Promise.all(
        allActiveAreasSnapshot.docs.map(async (areaSnapshot) => {
          const area:any = areaSnapshot.data();
          const activeMainCategoriesSnapshot = await getDocs(
            query(
              collection(this.firestore, 'service-catalogue', area.serviceCatalogue, 'categories'),
               where('enabled', '==', true),
            ),
          );
          const mainCategoriesData = await Promise.all(
            activeMainCategoriesSnapshot.docs.map(async (mainCategorySnapshot) => {
              console.log('service-catalogue', area.serviceCatalogue, 'categories',mainCategorySnapshot.id,'categories',);
              const enabledSubCategoriesSnapshot = await getDocs(
                query(
                  collection(
                    this.firestore,
                    'service-catalogue',
                    area.serviceCatalogue,
                    'categories',
                    mainCategorySnapshot.id,
                    'categories',
                  ),
                  where('enabled', '==', true),
                )
              );
              const subCategoriesData = enabledSubCategoriesSnapshot.docs.map((subCategorySnapshot) => ({
                ...subCategorySnapshot.data(),
                id: subCategorySnapshot.id,
              }));
  
              return {
                  ...mainCategorySnapshot.data(),
                  id: mainCategorySnapshot.id,
                  subCategories: subCategoriesData,
              };
            }),
          );
          return {
            ...areaSnapshot.data(),
            id: areaSnapshot.id,
            categories : mainCategoriesData
          }
        }),
      );
      return areasData;
    } catch (error) {
      console.error('Error loading service catalog:', error);
      throw error;
    }
  }

  async uploadBasicDetails(
    aadhaarImage: File,
    panImage: File,
    userImage: File,
    userId: string,
  ) {
    let loader = await this.toastService.presentLoading(
      'Uploading Basic Details',
    );
    try {
      let imageAadhaarUrl = await this.fileService.uploadFile(
        aadhaarImage,
        `agents/${userId}/aadhaar`,
        'Aadhaar',
      );
      let imagePanUrl = await this.fileService.uploadFile(
        panImage,
        `agents/${userId}/pan`,
        'Pan',
      );
      let imageUserUrl = await this.fileService.uploadFile(
        userImage,
        `agents/${userId}/profile`,
        'Profile',
      );
      loader.dismiss();
      return {
        aadhaarImage: imageAadhaarUrl,
        panImage: imagePanUrl,
        userImage: imageUserUrl,
      };
    } catch (error) {
      loader.dismiss();
      throw error;
    }
  }

  async completeSignup(pendingUser: PendingUser, user: AuthUserReadOnly) {
    let loader = await this.toastService.presentLoading('Completing Signup');
    let newUser: Agent = {
      address: {
        addressLine: pendingUser.street!,
        area: pendingUser.area!,
        city: pendingUser.city!,
        pinCode: pendingUser.pincode!,
        state: pendingUser.state!,
        geographicalPoint: new GeoPoint(
          pendingUser.latitude!,
          pendingUser.longitude!,
        ),
      },
      dateOfBirth: pendingUser.dateOfBirth!,
      email: pendingUser.email!,
      gender: pendingUser.gender!,
      working: true,
      name: pendingUser.name!,
      phoneNumber: user.phoneNumber!,
      photoUrl: pendingUser.userImage!,
      selectedJobSubCategories: pendingUser.selectedCategories!,
      uid: user.uid!,
      userProofDocument: {
        aadhaarImageUrl: pendingUser.aadhaarImage!,
        aadhaarNumber: pendingUser.aadhaarNumber!,
        panNumber: pendingUser.panNumber!,
        panUrl: pendingUser.panImage!,
      },
      perDayJobs: 7,
      workingHours: await this.getAllActiveWorkingHours(),
      selectedAreas: await this.selectedAreas(pendingUser),
      active: false,
      createdDate: Timestamp.fromDate( new Date()),
    };
    if (this.notificationService.currentToken) {
      newUser.notificationToken = this.notificationService.currentToken;
    }
    try {
      console.log(newUser);
      let setDocRef = await setDoc(
        doc(this.firestore, 'agents', newUser.uid),
        newUser,
      );
      loader.dismiss();
      return setDocRef;
    } catch (error) {
      loader.dismiss();
      throw error;
    }
  }
  getAllActiveWorkingHours(){
    return this.slotService.getTimeSlots().then((timeSlots)=>{
      return timeSlots.docs.map((timeSlot)=>{
          const timeSlotData = timeSlot.data() as TimeSlot;
          // Update the 'enable' property based on the 'active' status
          timeSlotData.enabled = timeSlotData.active;
          timeSlotData.id = timeSlot.id
          return timeSlotData;
        })
        .filter((timeSlot)=>{
          return timeSlot.active;
        })
    });
  }
  saveWorkingSlots(userId: string) {
    let startDate = new Date();
    let slots: Slot[] = [];
    // Create slots for the next 7 days
    const createSlotsPromises = Array.from({ length: 7 }).map((_, i) => {
      let newDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const slot: Slot = {
        id: newDate.toISOString().split('T')[0],
        day: Timestamp.fromDate(newDate),
        working: true,
        bookings: [],
      };
      slots.push(slot);
      return slot;
    });
  
    // Update slots in Firestore
    const updateSlotsPromises = slots.map(async (slot) => {
      slot.id = new Date(slot.day.toDate().getTime())
        .toISOString()
        .split('T')[0];
      await setDoc(
        doc(this.firestore, `agents/${userId}/slots/${slot.id}`),
        slot
      );
    });
  
    // Execute both create and update promises concurrently
    return Promise.all([...createSlotsPromises, ...updateSlotsPromises]);
  }
  selectedAreas(pendingUser :PendingUser,){
    const uniqueSet = new Set();
        const selectedArea = pendingUser.selectedCategories!
          .filter(item => {
            const key = `${item.areaId}-${item.serviceCatalogue}`;
            if (!uniqueSet.has(key)) {
              uniqueSet.add(key);
              return true;
            }
            return false;
          })
          .map(item => ({ areaId: item.areaId, serviceCatalogue: item.serviceCatalogue,stateId : pendingUser.state!.id,cityId: pendingUser.city!.id, }));
           console.log('Unique Area Ids Array:', selectedArea)
           return selectedArea||[]
  }
}
