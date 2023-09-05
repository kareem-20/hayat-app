import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
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
    this.getProducts();
    this.whatsapp = this.dataService.whatsapp;
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
    let url = '/product&status=1';
    url += `&discount=${true}`;
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.searchQuery) url += `&searchText=${this.searchQuery}`;

    return url.replace('&', '?');
  }
  async openWhatsapp(item: any) {
    const msg =
      ` ${item.image[0]}
      ${item?.name}  \r\n  ${item?.description} \r\n ${item?.price} د.ع` +
      ' \r\n ';
    if (this.whatsapp) {
      this.iab.create(`https://wa.me/${this.whatsapp}?text=${msg}`, '_system');
    } else this.helpers.presentToast('الوتساب غير مفعل حاليا');
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
  trackFn(item) {
    return item?._id;
  }
  detailsItem(item: any, index: number) {
    let similars = this.products.slice(index + 1, index + 6);
    this.dataService.addParams = {
      item: item,
      similars,
    };
    this.navCtrl.navigateForward('product-details');
  }

  // async redirectToWhatsApp(item: any) {
  //   const phoneNumber = '+201066655063';
  //   const message = item?.name + '\n' + item?.description;
  //   const imageUrl = item?.image;
  //   const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
  //     message
  //   )}&image=${encodeURIComponent(imageUrl)}`;

  //   this.iab.create(whatsappUrl, '_system');
  // }
}
