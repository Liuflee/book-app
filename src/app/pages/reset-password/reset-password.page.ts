import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async resetPassword() {
    if (!this.email) {
      this.presentAlert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando instrucciones...',
    });
    await loading.present();

    this.authService.resetPassword(this.email).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.presentAlert('Éxito', 'Se han enviado las instrucciones a tu correo electrónico.');
        this.navCtrl.navigateBack('/login');
      },
      error: async (err) => {
        await loading.dismiss();
        this.presentAlert('Error', 'No se pudo procesar la solicitud. Inténtalo de nuevo.');
      }
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
