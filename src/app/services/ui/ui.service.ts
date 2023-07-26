import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  darkOn: boolean = false;
  constructor() {}

  watchTheme() {
    let prefersDark = window.matchMedia('(prefers-color-scheme : dark )');
    console.log(prefersDark.matches);

    // const toggle = document.querySelector('#themeToggle');
    // toggle.addEventListener('ionChange', (ev) => {
    //   console.log(ev);

    //   // document.body.classList.toggle('dark', ev.detail.checked);
    // });
    prefersDark.addEventListener('change', (media) => {
      this.toggleDarkTheme(media.matches);
    });
    let color = localStorage.getItem('color') == 'true' ? true : false;
    if (localStorage.getItem('color') == 'true') {
      this.toggleDarkTheme(true);
    } else {
      this.toggleDarkTheme(false);
    }

    console.log(color);

    this.darkOn = prefersDark.matches;
  }

  toggleDarkTheme(enable: boolean) {
    localStorage.setItem('color', `${enable}`);
    document.body.classList.toggle('dark', enable);
  }
}
