import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('buttonState', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('pressed', style({
        transform: 'scale(0.95)'
      })),
      transition('normal <=> pressed', animate('100ms ease-in')),
    ])
  ]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  buttonState: string = 'normal';

  constructor(private navCtrl: NavController) {}

  // Este evento se ejecuta cada vez que entras a la página
  ionViewWillEnter() {
    this.clearFields();
  }

  // Función para limpiar los campos
  clearFields() {
    this.username = '';
    this.password = '';
  }

  login() {
    if (this.username && this.password) {
      // Guardar el nombre de usuario en el almacenamiento local
      localStorage.setItem('username', this.username);
      this.navCtrl.navigateForward('/home');
    }
  }

  goToResetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }

  onButtonPress() {
    this.buttonState = 'pressed';
  }

  onButtonRelease() {
    this.buttonState = 'normal';
  }
}
