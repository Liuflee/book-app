
import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string;
  password: string;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.email = '';
    this.password = '';
  }

  async register() {

    if (!this.isValidEmail(this.email)) {
      await this.showToast("Formato de email no valido.");
      return;
    }

    if (!this.isValidPassword(this.password)) {
      await this.showToast("La contraseña debe ser desde 6-20 caracteres, con una mayuscula y un número a lo mínimo.");
      return;
    }


    try {
      await this.authService.register(this.email, this.password);
      alert('Registro exitoso. Puedes acceder a tu cuenta.');
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error de registro:', error);
      await this.showToast('Error al registrarse, intentalo denuevo luego de revisar tus datos.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.[A-Z])(?=.\d)[A-Za-z\d]{6,20}$/;
    return passwordRegex.test(password);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }
}