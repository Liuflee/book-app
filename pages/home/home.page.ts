// home.page.ts
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = '';

  constructor(private navCtrl: NavController) {
    this.username = localStorage.getItem('username') || 'Invitado';
  }

  goToTabs() {
    this.navCtrl.navigateForward('/tabs');
  }
}
