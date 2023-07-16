import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}
  nav(route: string) {
    this.navCtrl.navigateForward(route);
  }
}
