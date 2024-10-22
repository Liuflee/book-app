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
        // Usa AuthService para iniciar sesión
        await this.authService.login(this.username, this.password);
        // Si el inicio de sesión es exitoso, redirige a la página principal
        this.navCtrl.navigateForward('/home');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Aquí puedes manejar el error y mostrar un mensaje al usuario si lo deseas
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
