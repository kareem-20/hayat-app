import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  categoryId: any;
  brand: any;
  item: any;
  similars: any[] = [];
  slide: any;
  whatsapp: string;
  sliders: any = [];
  slideOpts = {
    // slidesPerView: 1.09,
    // spaceBetween: 10,
    // autoplay: true,
    autoplay: true,
    slidesPerView: 1,
    spaceBetween: 12,
    pagination: true,
  };
  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private helpers: HelpersService,
    private iab: InAppBrowser,
    private modalCtrl: ModalController
  ) {}
  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.brand = this.dataService.myParams.brand;
    this.item = this.dataService.myParams.item;
    this.similars = this.dataService.myParams.similars;
    this.slide = this.dataService.myParams.slide;
    this.whatsapp = this.dataService.whatsapp;
    this.sliders = this.item.image;
  }
  async openWhatsapp(item: any) {
    const msg =
      ` ${item.image[0]}
    ${item?.name}  \r\n  ${item?.description} \r\n ${item?.price} د.ع` +
      ' \r\n ';
    console.log(this.whatsapp);

    if (this.whatsapp)
      this.iab.create(`https://wa.me/${this.whatsapp}?text=${msg}`, '_system');
    else this.helpers.presentToast('الوتساب غير مفعل حاليا');
  }

  ngOnInit() {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
