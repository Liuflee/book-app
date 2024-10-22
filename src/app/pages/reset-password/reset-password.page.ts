import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; 

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
  
        await this.authService.resetPassword(this.username);
        alert('Las instrucciones para restablecer la contraseña se han enviado a su correo electrónico.');
        this.navCtrl.navigateBack('/login');
      } catch (error) {
        console.error('Error al enviar el email de restablecimiento:', error);
        alert('Hubo un problema al enviar el correo. Asegúrate de que el correo esté registrado.');
      }
    }
  }
}
