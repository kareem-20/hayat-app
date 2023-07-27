import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { AuthService } from './services/auth/auth.service';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { Style, StatusBar } from '@capacitor/status-bar';
import { register } from 'swiper/element/bundle';
import { UiService } from './services/ui/ui.service';
import { CartService } from './services/cart/cart.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platForm: Platform,
    private storage: Storage,
    private authService: AuthService,
    private navCtrl: NavController,
    private cartService: CartService,

    private uiService: UiService
  ) {
    this.initApp();
  }
  async initApp() {
    await this.platForm.ready();
    await this.storage.create();
    // await this.checkUser();
    await this.setStatusBar(Style.Light, '#353542', false);
    this.uiService.watchTheme();
    await this.cartService.reloadCart();

    this.navCtrl.navigateRoot('splash');
  }

  async setStatusBar(style: any, color: string, overlay: boolean) {
    if (Capacitor.getPlatform() == 'web') return;
    await StatusBar.setStyle({ style });
    if (this.platForm.is('ios')) return;
    await StatusBar.setBackgroundColor({ color });
    await StatusBar.setOverlaysWebView({ overlay });
  }
}
