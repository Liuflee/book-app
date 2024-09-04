import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string;

  constructor(private navCtrl: NavController) {
    this.username = '';
  }

  resetPassword() {
    if (this.username) {
      alert('Las instrucciones para restablecer la contraseña se han enviado a su correo electrónico.');
      this.navCtrl.navigateBack('/login');
    }
  }
}
