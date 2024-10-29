import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.username = '';
  }

  async resetPassword() {
    if (!this.username) {
      await this.showAlert('Por favor, ingresa un correo electrónico.');
      return;
    }

    try {
      await this.authService.resetPassword(this.username);
      await this.showAlert('Las instrucciones para restablecer la contraseña se han enviado a su correo electrónico.');
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al enviar el email de restablecimiento:', error);
      await this.showAlert('Hubo un problema al enviar el correo. Asegúrate de que el correo esté registrado.');
    }
  }

  private async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}