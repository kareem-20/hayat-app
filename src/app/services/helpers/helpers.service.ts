import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  isLoading: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private platForm: Platform,
    private toastCtrl: ToastController
  ) {}

  async showLoading(message = '') {
    this.isLoading = true;
    await this.loadingCtrl
      .create({
        message: message,
      })
      .then((loading) => {
        loading.present().then((_) => {
          if (!this.isLoading) loading.dismiss();
        });
      });
  }

  dismissLoading() {
    this.isLoading = false;
    this.loadingCtrl.dismiss().catch((e) => console.log('dismissed'));
  }

  async presentToast(message, color = 'dark') {
    let toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      cssClass: 'ion-text-center',
      color,
      buttons: [
        {
          icon: 'close',
        },
      ],
    });

    await toast.present();
  }
  async setStatusBar(style: any, color: string, overlay: boolean) {
    if (Capacitor.getPlatform() == 'web') return;
    await StatusBar.setStyle({ style });
    if (this.platForm.is('ios')) return;
    await StatusBar.setBackgroundColor({ color });
    await StatusBar.setOverlaysWebView({ overlay });
  }
}
