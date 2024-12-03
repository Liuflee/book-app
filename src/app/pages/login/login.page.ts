import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Usamos Router de Angular
import { AuthService } from '../../services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
    private router: Router,  // Usamos Router en lugar de NavController
    private authService: AuthService,
    private alertController: AlertController
  ) { }

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

        // Redirigir a la página de tabs después de login exitoso
        this.router.navigate(['/tabs/books']);  // Aquí usamos Router para la redirección
      } catch (error) {
        console.error('Login error:', error);
        this.showAlert('Login inválido', 'El email o la contraseña no son válidos. Intenta de nuevo.');
      }
    } else {
      this.showAlert('Falta información', 'Complete los campos para continuar.');
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
    this.router.navigate(['/reset-password']); // Redirigir a la página de reset
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirigir a la página de registro
  }

  onButtonPress() {
    this.buttonState = 'pressed';
  }

  onButtonRelease() {
    this.buttonState = 'normal';
  }
}
