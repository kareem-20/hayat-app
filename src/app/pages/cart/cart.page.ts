import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  items: any[] = [];
  whatsapp: string;

  constructor(
    private navCtrl: NavController,
    private cartService: CartService,
    private helpers: HelpersService,
    private dataService: DataService,
    private iab: InAppBrowser,

    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.items = this.cartService.items;
    this.whatsapp = this.dataService.whatsapp;

    console.log(this.items);
  }

  async deleteItem(item: any, i: number) {
    const alert = await this.alertCtrl.create({
      header: 'حذف',
      message: 'متاكد من حذف هذا العنصر',
      mode: 'ios',
      buttons: [
        {
          text: 'حذف',
          handler: () => {
            this.cartService.updateCart(this.items[i]);
            this.items.splice(i, 1);
          },
        },
        {
          text: 'الغاء',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  nav(path?: string) {
    if (path) return this.navCtrl.navigateForward(path);
    this.navCtrl.pop();
  }

  clearCart() {
    this.cartService.clearCart().then(() => {
      this.items = [];
    });
  }
  async sendInvoice() {
    await this.helpers.showLoading();
    let body = this.items.map((item) => {
      return item._id;
    });
    console.log(body);

    this.dataService.postData('/invoice/', { products: body }).subscribe(
      (res) => {
        console.log(res);

        this.helpers.dismissLoading();
        this.clearCart();
        if (this.whatsapp) {
          //
          this.iab.create(
            `https://wa.me/${this.whatsapp}?text=${res}`,
            '_system'
          );
        } else this.helpers.presentToast('الوتساب غير مفعل حاليا');
      },
      (err) => {
        this.helpers.dismissLoading();
        this.helpers.presentToast('خطأ بالشبكة');
      }
    );
  }
}
