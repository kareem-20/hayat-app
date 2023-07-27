import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.page.html',
  styleUrls: ['./brands.page.scss'],
})
export class BrandsPage implements OnInit {
  categoryId: any;
  brands: any[] = [];
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  constructor(
    private dataService: DataService,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.getBrands();
  }

  ngOnInit() {}

  getBrands(ev?: any) {
    let url = '/brand';
    if (this.categoryId) url += `?category=${this.categoryId}`;
    this.dataService.getData(url).subscribe(
      (res: any) => {
        console.log(res);
        this.brands = res;
        this.brands.length ? this.showContentView(ev) : this.showEmptyView(ev);
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }
  openProducts(brand) {
    this.dataService.addParams = {
      categoryId: this.categoryId,
      brand: brand,
    };
    this.navCtrl.navigateForward('/products');
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
  doRefresh(ev: any): void {
    // this.skip = 0
    this.getBrands(ev);
  }

  nav(route) {
    this.navCtrl.navigateForward(route);
  }
}
