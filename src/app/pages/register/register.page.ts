import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string;
  password: string;

  constructor(private navCtrl: NavController, private authService: AuthService) {
    this.email = '';
    this.password = '';
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al registrarse:', error);
      alert('Hubo un problema al registrarse. Asegúrate de que el correo sea válido y que la contraseña tenga al menos 6 caracteres.');
    }
  }
}
