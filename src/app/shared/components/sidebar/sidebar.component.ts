import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/app.structure';
import { Agent } from '../../models/agent.structure';
import { Browser } from '@capacitor/browser';
import { logout } from 'src/app/main/home/actions';

@Component({
  selector: 'app-sidebar-new',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  agentData: Observable<Agent | null> = this.store.select('app', 'agentData');
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private authService: AuthService,
    private menuController: MenuController,
    private store: Store<{ app: AppState }>,
  ) {}

  ngOnInit() {}

  async about() {
    this.close();
    await Browser.open({ url: 'https://jaipurservicecompany.com/' });
  }

  close() {
    this.menuController.close();
  }

  async logout() {
    await this.store.dispatch(logout.logout());
    this.modalCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
