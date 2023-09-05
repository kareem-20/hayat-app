import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private authService: AuthService,
    private fcmService: FcmService,
    private dataService: DataService
  ) {
    this.getSetting();
    setTimeout(() => {
      // this.checkUser();
      this.initApp();
    }, 3000);
  }

  ngOnInit() {}
  async initApp() {
    await this.fcmService.initPush();
    await this.navCtrl.navigateRoot('/tabs/home');
  }
  async checkUser() {
    const user = await this.storage.get('user');
    console.log(user);

    if (user) {
      this.authService.userData = user;
      await this.fcmService.initPush();

      await this.navCtrl.navigateRoot('/tabs/home');
    } else {
      await this.navCtrl.navigateRoot('/login');
    }
  }

  getSetting() {
    this.dataService.getData('/settings/').subscribe((res: any) => {
      this.dataService.settings = res;
      this.dataService.whatsapp = res.whatsapp;
      this.dataService.instagram = res.instagram;
      this.dataService.messenger = res.messenger;
    });
  }
}
