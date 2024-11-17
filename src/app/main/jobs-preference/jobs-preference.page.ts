import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, withLatestFrom } from 'rxjs';
import {
  Category,
  SubCategory,
} from 'src/app/shared/models/category.structure';
import { JobsPreferencePageState } from './models/page.structure';
import { Area } from 'src/app/auth/signup/models/address.structure';
import { AppState } from 'src/app/shared/models/app.structure';
import { noUserFound, signupRequired } from 'src/app/shared/actions';
import {
  deselectCategory,
  loadAreasAction,
  loadInitialJobPreferenceAction,
  selectCategory,
  submitJobPreference,
} from './actions/page.action';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs-preference',
  templateUrl: './jobs-preference.page.html',
  styleUrls: ['./jobs-preference.page.scss'],
})
export class JobsPreferencePage implements OnInit {
  areaWiseServiceCatalogue: Observable<any[]>;
  loading: Observable<boolean> = this.store.select('jobsPreference','loadingAreaWiseCatlog');
  fakeServices: number[] = [];
  constructor( public router : Router,private menuController: MenuController,
    private store: Store<{
      jobsPreference: JobsPreferencePageState;
      app: AppState;
    }>,
  ) {
    this.areaWiseServiceCatalogue = this.store.select('jobsPreference', 'areaWiseCatlog')
      .pipe(
        withLatestFrom(this.store.select('app')),
        map(([areas, app]) => {
          if (!app.currentUser) {
            this.store.dispatch(noUserFound());
            throw new Error('No user found');
          }
          if (!app.agentData) {
            this.store.dispatch(signupRequired(app.currentUser!));
            throw new Error('Signup required');
          }
          return areas.map((area: any) => {
            return {
              ...area,
              active: app.agentData!.selectedAreas.find((selectedArea) => selectedArea.areaId === area.id,) ? true : false,
              categories: area.categories.map((category: Category) => {
                return {
                  ...category,
                  subCategories: category.subCategories.map((subCategory) => {
                    return {
                      ...subCategory,
                      checked: app.agentData!.selectedJobSubCategories.find(
                        (selectedSubCategory) => {
                          return (
                            selectedSubCategory.categoryId == category.id &&
                            selectedSubCategory.subCategoryId == subCategory.id && 
                            selectedSubCategory.areaId == area.id &&
                            selectedSubCategory.serviceCatalogue == area.serviceCatalogue
                          );
                        }
                      ),
                    };
                  }),
                };
              }),
            };            
          });
        })
      );

      for (let index = 0; index < 10; index++) {
        this.fakeServices.push(index);
      }
  }

  ngOnInit() {
    this.store.dispatch(loadInitialJobPreferenceAction());
    this.store.dispatch(loadAreasAction());
  }

  selectCategory(event: any, category: Category, subCategory: SubCategory,area: any) {
    if (event.detail.checked) {
      this.store.dispatch(selectCategory({ category, subCategory,area }));
    } else {
      this.store.dispatch(deselectCategory({ category, subCategory,area }));
    }
  }
  submit() {
    this.store.dispatch(submitJobPreference());
  }
  close(){
    this.router.navigate(['main/home'])
    this.menuController.open();
  }

  handleCheckboxClick(event: Event) {
    event.stopPropagation();
  }
}
