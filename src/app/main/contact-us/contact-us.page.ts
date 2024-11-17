import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContactState } from './reducer/contact.reducer';
import { contactLoad } from './actions/contact';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  contacts: any;
  isLoading$: Observable<any> | null = null;

  constructor(private store: Store<{ contact: ContactState }>) {}

  ngOnInit(): void {
    this.store.dispatch(contactLoad());
    this.store
      .select('contact', 'contacts')
      .subscribe((contact) => (this.contacts = contact[0]));
    this.isLoading$ = this.store.select('contact', 'isLoading');
  }
}
