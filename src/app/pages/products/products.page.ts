import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  categoryId: string;
  brand: any;
  products: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  searchQuery: string = '';
  skip: number = 0;
  whatsapp: string;

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private helpers: HelpersService,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.brand = this.dataService.myParams.brand;
    this.whatsapp = this.dataService.whatsapp;

    this.getProducts();
  }

  getProducts(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);
        this.products = res;
        this.products.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  get endPoint(): string {
    let url = '/product';
    if (this.categoryId) url += `&category=${this.categoryId}`;
    if (this.brand) url += `&brand=${this.brand._id}`;
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.searchQuery) url += `&searchText=${this.searchQuery}`;

    return url.replace('&', '?');
  }
  async openWhatsapp(item: any) {
    const msg =
      `${item?.name}\n${item?.description}\n${item?.price}` +
      '\n' +
      'https://unsplash.com/photos/6VPEOdpFNAs';
    console.log(`https://wa.me/+201066655063?text=${msg}`);

    if (this.whatsapp) {
      this.iab.create(`https://wa.me/${this.whatsapp}?text=${msg}`, '_system');
      // await Share.share({
      //   title: item?.name,
      //   text: item?.description,
      //   url: item?.image,
      // });
    } else this.helpers.presentToast('الوتساب غير مفعل حاليا');
  }

  async redirectToWhatsApp(item: any) {
    const phoneNumber = '+201066655063';
    const message =
      item?.name +
      '\n ' +
      item?.description +
      '\n ' +
      'https://unsplash.com/photos/6VPEOdpFNAs' +
      '\n ' +
      item?.name +
      '\n ' +
      item?.description +
      '\n ' +
      'https://unsplash.com/photos/6VPEOdpFNAs';
    const imageUrl = item?.image;
    // WhatsApp Web API Endpoint
    const whatsappApiUrl = 'https://wa.me';

    // Encode the message and image URL
    const encodedMessage = encodeURIComponent(message);
    const encodedImageUrl = encodeURIComponent(imageUrl);

    // Create the WhatsApp share link
    const whatsappUrl = `${whatsappApiUrl}/${phoneNumber}?text=${message}`;
    // https://wa.me/+201066655063/?text=teststsafdssdsdf\nhttps://unsplash.com/photos/6VPEOdpFNAs
    this.iab.create(whatsappUrl, '_system');
  }
  showContentView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
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

  nav(route: string) {
    this.navCtrl.navigateForward(route);
  }
  loadData(ev?: any) {
    this.skip += 1;
    this.getProducts(ev);
  }

  back() {
    this.navCtrl.back();
  }
  trackFn(item) {
    return item?._id;
  }

  onChange(ev) {
    console.log(ev);
    this.getProducts();
  }

  detailsItem(item: any, index: number) {
    let similars = this.products.slice(index + 1, index + 6);
    this.dataService.addParams = {
      item: item,
      categoryId: this.categoryId,
      brand: this.brand,
      similars,
    };
    this.navCtrl.navigateForward('product-details');
  }
}
