// tabs.page.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  async logout() {
    try {
      await this.authService.logout(); 
      this.navCtrl.navigateRoot('/login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
