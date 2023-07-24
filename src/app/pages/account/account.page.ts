import { Component, OnInit, ViewChild } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonToggle, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  @ViewChild('myToggle') themeToggle!: IonToggle;
  darkOn: boolean = false;
  whatsapp: string;
  instagram: string;
  messenger: string;
  constructor(
    private uiService: UiService,
    private dataService: DataService,
    private navCtrl: NavController,
    private helpers: HelpersService,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    // this.uiService.watchTheme();
    this.darkOn = this.uiService.darkOn;
    this.whatsapp = this.dataService.whatsapp;
    this.instagram = this.dataService.instagram;
    this.messenger = this.dataService.messenger;
  }
  changeTheme(ev?: any) {
    console.log(ev.detail.checked);
    this.uiService.toggleDarkTheme(ev.detail.checked);
  }
  nav(route) {
    this.navCtrl.navigateForward(route);
  }
  async openWhatsapp() {
    if (this.whatsapp)
      this.iab.create(`https://wa.me/${this.whatsapp}`, '_system');
    else this.helpers.presentToast('الوتساب غير مفعل حاليا');
  }
  async openinstagram() {
    if (this.instagram) this.iab.create(`${this.instagram}`, '_system');
    else this.helpers.presentToast('الانستجرام غير مفعل حاليا');
  }
  async openmessenger() {
    if (this.messenger) this.iab.create(`${this.messenger}`, '_system');
    else this.helpers.presentToast('المسنجر غير مفعل حاليا');
  }
}
