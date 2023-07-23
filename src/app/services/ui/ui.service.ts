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
    this.toggleDarkTheme(prefersDark.matches);
    this.darkOn = prefersDark.matches;
  }

  toggleDarkTheme(enable: boolean) {
    document.body.classList.toggle('dark', enable);
  }
}
