import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { NotificationService } from './services/notification.service';
import { AppState } from 'src/app/shared/models/app.structure';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notification: boolean = true;
  deletedNotification: string = '';
  myTimeout: any = '';
  showUndoPopup: boolean = false;
  agentData$ = this.store.select('app', 'agentData');
  notificationData$ = this.store.select('app', 'notifications');
  userId: any = '';
  isLoading$: Observable<any> | null = null;
  public toastButtons = [
    {
      text: 'Undo',
      role: 'cancel',
      handler: () => {
        this.onUndoDelete();
      },
    },
  ];
  todayNotifications: any = [];
  olderNotifications: any = [];

  constructor(
    public location: Location,
    private toastService: ToastService,
    private popoverController: PopoverController,
    public notificationService: NotificationService,
    private store: Store<{app: AppState }>
  ) {}

  ngOnInit() {
    this.agentData$.subscribe((agentData) => {
      this.userId = agentData?.uid;
    });
    this.notificationData$.subscribe((notifications: any) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      this.todayNotifications = notifications.filter((notification:any) => { return  notification.createdAt.toDate() >= currentDate && notification.createdAt.toDate() <= new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)});
      this.olderNotifications = notifications.filter((notification:any) => { return  notification.createdAt.toDate() <= currentDate });

    });
  }

  markAllNotificationsAsRead() {
    this.notificationService
      .markAllNotificationsAsRead(this.userId)
      .then(() => {
        this.toastService.presentToast(
          'All notifications marked as read successfully.'
        );
        this.popoverController.dismiss();
      })
      .catch((error: any) => {
        this.toastService.presentToast('Error marking notifications as read:');
        console.error('Error marking notifications as read:', error);
      });
  }

  onDeleteNotification(notificationId: string,notificationType: any) {
    this.myTimeout = setTimeout(() => {
      this.notificationService
        .deleteNotification(this.userId, notificationId)
        .then(() => {
          if (notificationType == 'older') {
            this.olderNotifications = this.olderNotifications.filter(
              (obj: any) => obj.id !== notificationId
            );
          } else
            this.todayNotifications = this.todayNotifications.filter(
              (obj: any) => obj.id !== notificationId
            );
            this.toastService.presentToast(
              'Notification deleted successfully.'
            );
        })
        .catch((error: any) => {
          this.toastService.presentToast(
            'Error deleting notification.'
          );
          console.error('Error deleting notification:', error);
        });
    }, 3000);
  }
  onUndoDelete() {
    clearTimeout(this.myTimeout);
  }
}
