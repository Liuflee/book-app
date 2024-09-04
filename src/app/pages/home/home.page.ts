import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = 'Gato epico';

  constructor(private navCtrl: NavController) {}

  goToBookPage() {
    this.navCtrl.navigateForward('/books');
  }
}
