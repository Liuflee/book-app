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
    // Recuperar el nombre de usuario del almacenamiento local
    this.username = localStorage.getItem('username') || 'Invitado';
  }

  goToBookPage() {
    this.navCtrl.navigateForward('/books');
  }
}
  