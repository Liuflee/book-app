import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AnimationController, Animation } from '@ionic/angular'; // Import Animation

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = '';
  //Creando cosita para almacenar la animaci[on y que pare cu[ando nos vallamo'
  private animation: Animation | undefined; 

  constructor(private navCtrl: NavController, private animationCtrl: AnimationController) {
    // Sacando el Username
    this.username = localStorage.getItem('username') || 'Invitado';
  }

  // Cosita pa' que se mueva de pana la fotito
  imageSwing() {
    const imageElement = document.querySelector('.login-image');

    if (imageElement) {
      this.animation = this.animationCtrl.create()
        .addElement(imageElement)
        .duration(2000)
        .iterations(Infinity)
        .keyframes([
          { offset: 0, transform: 'translateX(0px) rotate(0deg)' },
          { offset: 0.25, transform: 'translateX(200px) rotate(10deg)' },
          { offset: 0.5, transform: 'translateX(0px) rotate(0deg)' },
          { offset: 0.75, transform: 'translateX(-200px) rotate(-10deg)' }
        ])
        .easing('ease-out');

      this.animation.play(); 
    } else {
      console.error('Qué le pasó a la foto__?¡??');
    }
  }

  goToBookPage() {
    if (this.animation) {
      this.animation.stop();
    }
    this.navCtrl.navigateForward('/books');
  }
}