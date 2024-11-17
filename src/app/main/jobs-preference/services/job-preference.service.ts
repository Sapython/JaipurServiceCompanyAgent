import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ToastService } from 'src/app/shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class JobPreferenceService {
  constructor(
    private firestore: Firestore,
    private toastService: ToastService,
  ) {}

  loadAreas(stateId: string, cityId: string) {
    console.log('Fetching', 'states', stateId, 'cities', cityId, 'areas');
    return getDocs(
      collection(this.firestore, 'areas', stateId, 'cities', cityId, 'areas'),
    );
  }

  async loadAreaWiseServiceCatalogue(stateId: string, cityId: string) {
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

  async saveSelectedCategories(
    userId: string,
    selectedJobSubCategories: {
      categoryId: string;
      subCategoryId: string;
    }[],
    selectedAreas: {
      stateId: string;
      cityId: string;
      areaId: string;
    }[],
  ) {
    let loader = await this.toastService.presentLoading(
      'Saving your preferences',
    );
    try {
      await updateDoc(doc(this.firestore, 'agents', userId), {
        selectedJobSubCategories,
        selectedAreas,
      });
      loader.dismiss();
    } catch (error) {
      console.error(error);
      loader.dismiss();
      throw error;
    }
  }
}
