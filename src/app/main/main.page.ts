import { Component, OnInit } from '@angular/core';
import { AppState } from '../shared/models/app.structure';
import { Store } from '@ngrx/store';
import { signOut } from '../shared/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  constructor(
    private store: Store<{ app: AppState }>,
    public router: Router,
  ) {}

  ngOnInit() {}

  signOut() {
    this.store.dispatch(signOut());
  }
}
