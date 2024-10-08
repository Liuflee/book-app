import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Usuario';
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateBack('/login');
  }

  // Aquí agregas la función que estaba faltando
  goToBookPage() {
    this.navCtrl.navigateForward('/book-page');  // Asegúrate de que la ruta sea correcta
  }
}
