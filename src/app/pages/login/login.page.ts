

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

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

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController 
  ) {}


  ionViewWillEnter() {
    this.clearFields();
  }


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
        console.error('Login error:', error);

        this.showAlert('Login invalido', 'El email o contraseña no son validos. Intenta denuevo.');
      }
    } else {

      this.showAlert('Falta información', 'Complete los campos para seguir.');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
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