import { Component, OnInit } from '@angular/core';
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
  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private helpers: HelpersService,
    private modalCtrl: ModalController
  ) {}
  ionViewWillEnter() {
    this.categoryId = this.dataService.myParams.categoryId;
    this.brand = this.dataService.myParams.brand;
    this.item = this.dataService.myParams.item;
    this.similars = this.dataService.myParams.similars;
    this.slide = this.dataService.myParams.slide;

    console.log(this.similars);
  }
  ngOnInit() {}
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
