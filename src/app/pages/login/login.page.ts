import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('buttonState', [
      state('normal', style({
        transform: 'scale(1)',
      })),
      state('pressed', style({
        transform: 'scale(0.95)',
      })),
      transition('normal <=> pressed', animate('100ms ease-in')),
    ])
  ]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  buttonState: string = 'normal';

  constructor(private navCtrl: NavController, private authService: AuthService) {}

  // Este evento se ejecuta cada vez que entras a la página
  ionViewWillEnter() {
    this.clearFields();
  }

  // Función para limpiar los campos
  clearFields() {
    this.username = '';
    this.password = '';
  }

  async login() {
    if (this.username && this.password) {
      try {
        await this.authService.login(this.username, this.password);
        this.navCtrl.navigateForward('/home');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    }
  }

  goToResetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
  
  onButtonPress() {
    this.buttonState = 'pressed';
  }

  onButtonRelease() {
    this.buttonState = 'normal';
  }
}
