import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';
import { DataService } from '../data/data.service';

const USER = 'user';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    private dataService: DataService,
    private storage: Storage,
    private helper: HelpersService,
    private navCtrl: NavController
  ) {}

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  removeCredentials() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem('isEmployee');

    return Promise.all([
      this.storage.remove(USER),
      this.storage.remove(REFRESH_TOKEN),
    ]);
  }

  private get refreshEndPoint(): string {
    return;
  }

  getRefreshToken() {
    let promise = new Promise(async (resolve, reject) => {
      let token = await this.storage.get(REFRESH_TOKEN);
      this.dataService.getData('/user/refreshToken?token=' + token).subscribe(
        (res: any) => {
          localStorage.setItem(ACCESS_TOKEN, res.accessToken);
          resolve(res.token);
        },
        (e) => reject(e)
      );
    });
    return from(promise);
  }

  async login(body: any) {
    await this.helper.showLoading();
    this.dataService.postData('/user/login', body).subscribe(
      async (user: any) => {
        this.userData = await this.storage.set(USER, user);
        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.helper.dismissLoading();
        this.navCtrl.navigateRoot('/tabs/home');
      },
      (err) => {
        this.helper.dismissLoading();
        if (err.status == 404)
          return this.helper.presentToast('خطأ برقم الهاتف او كلمة المرور');

        // if (err.status == 403)
        //   return this.helper.presentToast(
        //     'لقد تم تعطيل حسابك برجاء التواصل مع الشركة'
        //   );
        return this.helper.presentToast('خطأ بالشبكة');
      }
    );
  }

  async register(body: any) {
    await this.helper.showLoading();
    this.dataService.postData('/user/register', body).subscribe(
      async (user: any) => {
        this.userData = await this.storage.set(USER, user);
        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.helper.dismissLoading();
        this.navCtrl.navigateRoot('/tabs/home');
      },
      (err) => {
        this.helper.dismissLoading();
        if (err.status == 404)
          return this.helper.presentToast('خطأ برقم الهاتف او كلمة المرور');

        // if (err.status == 403)
        //   return this.helper.presentToast(
        //     'لقد تم تعطيل حسابك برجاء التواصل مع الشركة'
        //   );
        return this.helper.presentToast('خطأ بالشبكة');
      }
    );
  }
  async logOut() {
    this.helper.showLoading();
    await this.removeCredentials();
    this.helper.dismissLoading();
    this.navCtrl.navigateRoot('/login');
  }
}
