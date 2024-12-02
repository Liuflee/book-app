import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  userData: User;     
  password: string;   

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.userData = {
      email: '',
      name: '',
    };
    this.password = '';
  }

  async register() {
    if (!this.isValidEmail(this.userData.email)) {
      await this.showToast("Formato de email no válido.");
      return;
    }

    if (!this.isValidPassword(this.password)) {
      await this.showToast("La contraseña debe tener de 6 a 20 caracteres, una mayúscula y un número mínimo.");
      return;
    }

    if (!this.userData.name || !this.userData.email || !this.password) {
      await this.showToast("Por favor completa todos los campos.");
      return;
    }

    try {
      await this.authService.register(this.userData, this.password);

      this.sendConfirmationEmail();

      alert('Registro exitoso. Puedes acceder a tu cuenta.');
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error de registro:', error);
      await this.showToast('Error al registrarse, inténtalo de nuevo luego de revisar tus datos.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{6,20}$/;
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

  private sendConfirmationEmail() {
    const templateParams = {
      user_email: this.userData.email,  
      user_name: this.userData.name,
    };

    emailjs
      .send('service_s2yl7xd', 'template_26suoed', templateParams, 'LK0u50hihuFdV4RRl')
      .then(
        (response) => {
          console.log('Correo enviado con éxito:', response.status, response.text);
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
        }
      );
  }
}
