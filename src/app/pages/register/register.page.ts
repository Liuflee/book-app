import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    // Inicializar el formulario con validaciones
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async register() {
    if (this.registerForm.invalid) {
      this.presentAlert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando...',
    });
    await loading.present();

    // Llamar al servicio de autenticación para registrar el usuario
    this.authService.register(this.registerForm.value).subscribe({
      next: async (response) => {
        await loading.dismiss();
        this.presentAlert('Éxito', 'Registro exitoso. Puedes iniciar sesión ahora.');
        this.navCtrl.navigateForward('/login');
      },
      error: async (err) => {
        await loading.dismiss();
        this.presentAlert('Error', 'Error al registrarse. Intenta de nuevo.');
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
