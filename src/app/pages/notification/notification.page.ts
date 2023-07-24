import { DataService } from 'src/app/services/data/data.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notification: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  disableInfinity: boolean = false;
  skip: number = 0;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getNotification();
  }

  back() {
    this.navCtrl.pop();
  }

  navigate(route) {
    this.navCtrl.navigateForward(route);
  }

  getNotification(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);

        this.notification = this.skip ? this.notification.concat(res) : res;
        this.notification.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
        this.disableInfinity = res?.length == 0;
      },
      (err) => {
        this.showErrorView();
      }
    );
  }

  get endPoint() {
    let url = `/fcm`;
    if (this.skip) url += `?skip=${this.skip}`;

    return url;
  }
  doRefresh(ev?: any) {
    this.getNotification();
    ev.target.complete();
  }
  showContentView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    this.disableInfinity = false;
    if (ev) ev.target.complete();
  }

  showErrorView(ev?: any) {
    this.loading = false;
    this.errorView = true;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showEmptyView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = true;
    if (ev) ev.target.complete();
  }

  loadData(ev?: any) {
    this.skip += 1;
    this.getNotification(ev);
  }

  details(noti) {
    // this.dataService.addParams = { noti }
    // this.navCtrl.navigateForward('notification-details')
  }
}
