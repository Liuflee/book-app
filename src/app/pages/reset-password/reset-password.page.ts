import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  username: string;

  constructor(private navCtrl: NavController, private authService: AuthService) {
    this.username = '';
  }

  async resetPassword() {
    if (this.username) {
      try {
        // Usa AuthService para enviar el email de restablecimiento de contraseña
        await this.authService.resetPassword(this.username);
        alert('Las instrucciones para restablecer la contraseña se han enviado a su correo electrónico.');
        this.navCtrl.navigateBack('/login');
      } catch (error) {
        console.error('Error al enviar el email de restablecimiento:', error);
        // Aquí puedes manejar el error y mostrar un mensaje al usuario si lo deseas
        alert('Hubo un problema al enviar el correo. Asegúrate de que el correo esté registrado.');
      }
    }
  }
}
