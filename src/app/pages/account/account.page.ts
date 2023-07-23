import { Component, OnInit, ViewChild } from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  @ViewChild('myToggle') themeToggle!: IonToggle;
  darkOn: boolean = false;
  constructor(private uiService: UiService) {}

  ngOnInit() {
    // this.uiService.watchTheme();
    this.darkOn = this.uiService.darkOn;
  }
  changeTheme(ev?: any) {
    console.log(ev.detail.checked);
    this.uiService.toggleDarkTheme(ev.detail.checked);
  }
}
