import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Category,
  SubCategory,
} from 'src/app/shared/models/category.structure';
import { SignupState } from '../../models/signup.structure';
import { Observable, firstValueFrom } from 'rxjs';
import { Area, City, State } from '../../models/address.structure';
import { serviceCatalogue, signupActions } from '../../actions';
import { AppState } from 'src/app/shared/models/app.structure';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  areaWiseServiceCatalogue: Observable<any[]> = this.store.select(
    'signup',
    'categories',
  );
  areas1: Observable<Area[]> = this.store.select('signup', 'areas');
  fakeServices: number[] = [];
  loading: Observable<boolean> = this.store.select(
    'signup',
    'loadingCatalogue',
  );
  constructor(private store: Store<{ signup: SignupState; app: AppState }>) {
    // add fake services
    for (let index = 0; index < 10; index++) {
      this.fakeServices.push(index);
    }
  }

  ngOnInit() {
    this.store.dispatch(serviceCatalogue.LOAD());
  }

  selectCategory(event: any, category: Category, subCategory: SubCategory, area :any) {
    if (event.detail.checked) {
      this.store.dispatch(
        signupActions.selectCategory({ category, subCategory ,area}),
      );
    } else {
      this.store.dispatch(
        signupActions.deselectCategory({ category, subCategory,area }),
      );
    }
  }

  async selectArea(event: any, area: Area) {
    let pendingUser = await firstValueFrom(
      this.store.select('signup', 'pendingUser'),
    );
    console.log(pendingUser);
    if (pendingUser.state && pendingUser.city) {
      if (event.detail.checked) {
        this.store.dispatch(
          signupActions.selectArea({
            area,
            state: pendingUser.state,
            city: pendingUser.city,
          }),
        );
      } else {
        this.store.dispatch(
          signupActions.deselectArea({
            area,
            state: pendingUser.state,
            city: pendingUser.city,
          }),
        );
      }
    }
  }

  submit() {
    this.store.dispatch(signupActions.completeSignup());
  }
}
