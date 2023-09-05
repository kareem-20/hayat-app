import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-fav',
  templateUrl: './fav.page.html',
  styleUrls: ['./fav.page.scss'],
})
export class FavPage implements OnInit {
  fav: any[] = this.cartService.fav;

  categoryId: string;
  brand: any;
  products: any[] = [];
  subBrands: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  searchQuery: string = '';
  skip: number = 0;
  whatsapp: string;
  subBrand: any = null;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private helpers: HelpersService,
    private cartService: CartService,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.brand = this.dataService.myParams.brand;
    this.whatsapp = this.dataService.whatsapp;
    this.fav = this.cartService.fav;
  }
  checkItemsCart(items: any[]) {
    for (let item of items) {
      this.cartService.getItemCart(item);
    }
  }
  async redirectToWhatsApp(item: any) {
    const msg =
      ` ${item.image[0]}
    ${item?.name}  \r\n  ${item?.description} \r\n ${item?.price} د.ع` +
      ' \r\n ';
    if (this.whatsapp) {
      this.iab.create(`https://wa.me/${this.whatsapp}?text=${msg}`, '_system');
    } else this.helpers.presentToast('الوتساب غير مفعل حاليا');
  }
  nav(route: string) {
    this.navCtrl.navigateForward(route);
  }
  back() {
    this.navCtrl.back();
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

  addItem(product: any) {
    if (product.addedToCart)
      return this.helpers.presentToast('هذا المنتج مضاف بالفعل');
    this.cartService.addItem(product);
    product.addedToCart = true;
  }
  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }

  trackBy(index: number, pro: any): number {
    return pro.ITEM_CODE;
  }

  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
    this.fav = this.cartService.fav;
    if (this.fav.length === 0) this.emptyView = true;
  }
}
