import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

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

  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.brand = this.dataService.myParams.brand;

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
