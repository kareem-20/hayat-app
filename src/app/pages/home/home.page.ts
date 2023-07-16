import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';
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
    slidesPerView: 1.09,
    spaceBetween: 10,
    autoplay: true,
  };
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  nav(route: string): void {
    this.navCtrl.navigateForward(route);
  }
}
