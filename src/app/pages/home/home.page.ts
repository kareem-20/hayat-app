import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { ProductDetailsPage } from '../product-details/product-details.page';
import { CartService } from 'src/app/services/cart/cart.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
// import SwiperCore, { Pagination } from 'swiper';
// SwiperCore.use([Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  slideOpts = {
    // slidesPerView: 1.09,
    // spaceBetween: 10,
    // autoplay: true,
    autoplay: true,
    slidesPerView: 1,
    spaceBetween: 12,
    // pagination: true,
  };
  // @ViewChild('slides') slides:IonSlides
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  stopLoading: boolean = false;
  categories: any[] = [];
  sliders: any[] = [];
  mainSlider: any[] = [];
  cartCount: number;
  subscription: Subscription;
  recently: any[] = [];
  whatsapp: string;

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private cartService: CartService,
    private iab: InAppBrowser,
    private helpers: HelpersService,
    private modalCtrl: ModalController
  ) {
    this.watchCart();
  }

  async ngOnInit() {
    this.getData();
    this.whatsapp = this.dataService.whatsapp;
  }

  watchCart() {
    this.subscription = this.cartService.count.subscribe(
      (res) => (this.cartCount = res)
    );
    console.log(this.cartCount);
  }
  ionViewWillEnter() {
    this.whatsapp = this.dataService.whatsapp;
  }

  getData(ev?: any): void {
    forkJoin([
      this.dataService.getData(`/slide?status=1&type=2`),
      this.dataService.getData(`/category?status=1`),
      this.dataService.getData(`/slide?status=1&type=1`),
      this.dataService.getData('/product/recently'),
    ]).subscribe(
      (res: any[]) => {
        console.log(res);

        this.sliders = res[0];
        this.categories = res[1];
        this.mainSlider = res[2];
        this.recently = res[3];
        this.checkItemsFav([...this.recently]);

        this.categories.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  openCategory(cat: any): void {
    this.dataService.addParams = { categoryId: cat._id };
    this.navCtrl.navigateForward('/brands');
  }

  openSlideDetail(slider: any): Promise<void | boolean | Window> {
    if (slider?.product?._id) {
      this.dataService.addParams = { item: slider?.product, slide: true };
      return this.productModal();
    }

    if (slider?.category?._id) {
      // const index = this.categories.findIndex(cat => cat._id === slider?.category?._id)
      this.dataService.addParams = { categoryId: slider?.category?._id };
      return this.navCtrl.navigateForward('/brands');
    }
  }
  async productModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ProductDetailsPage,
      mode: 'md',
      // backdropDismiss: true,
      // backdropBreakpoint: 0.5,
      // breakpoints: [0.0, 0.5, 0.8],
    });
    await modal.present();
  }

  nav(route: string): void {
    this.navCtrl.navigateForward(route);
  }

  // View
  showContentView(ev?: any): void {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showErrorView(ev?: any): void {
    this.loading = false;
    this.errorView = true;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showEmptyView(ev?: any): void {
    this.loading = false;
    this.errorView = false;
    this.emptyView = true;
    if (ev) ev.target.complete();
  }
  trackFn(item) {
    return item?._id;
  }
  detailsItem(item: any, index: number) {
    let similars = this.recently.slice(index + 1, index + 6);
    this.dataService.addParams = {
      item: item,
      similars,
    };
    this.navCtrl.navigateForward('product-details');
  }

  async redirectToWhatsApp(item: any) {
    const msg =
      ` ${item.image[0]}
      ${item?.name}  \r\n  ${item?.description} \r\n ${item?.price} د.ع` +
      ' \r\n ';
    console.log(msg);

    console.log(`https://wa.me/${this.whatsapp}?text=${msg}`);

    if (this.whatsapp)
      this.iab.create(`https://wa.me/${this.whatsapp}?text=${msg}`, '_system');
    else this.helpers.presentToast('الوتساب غير مفعل حاليا');
  }

  addItem(product: any) {
    if (product.addedToCart)
      return this.helpers.presentToast('هذا المنتج مضاف بالفعل');
    this.cartService.addItem(product);
    product.addedToCart = true;
  }

  toggleFav(item: any) {
    item.favorite = !item?.favorite;
    this.cartService.toggleFav(item);
  }

  checkItemsFav(items: any[]) {
    for (let item of items) {
      this.cartService.getItemFavourit(item);
    }
  }
}
