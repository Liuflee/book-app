import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('buttonState', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('pressed', style({
        transform: 'scale(0.95)'
      })),
      transition('normal <=> pressed', animate('100ms ease-in')),
    ])
  ]
})

export class LoginPage {
  username: string = '';
  password: string = '';
  buttonState: string = 'normal';
  loginForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder
  ) {
    // Inicializar el formulario con validaciones
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewWillEnter() {
    this.clearFields();
  }

  clearFields() {
    this.username = '';
    this.password = '';
  }

  async login() {
    if (this.loginForm.invalid) {
      this.presentAlert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    // Llamar al servicio de autenticación
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: async (response) => {
        await loading.dismiss();
        // Suponiendo que el servicio retorna un token
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', this.loginForm.value.username);
        this.navCtrl.navigateForward('/home');
      },
      error: async (err) => {
        await loading.dismiss();
        this.presentAlert('Error', 'Credenciales incorrectas o servidor no disponible.');
      }
    });
  }

  goToResetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }

  onButtonPress() {
    this.buttonState = 'pressed';
  }

  onButtonRelease() {
    this.buttonState = 'normal';
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
