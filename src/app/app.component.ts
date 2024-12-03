import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Si el usuario está autenticado, redirigir a las tabs
        this.router.navigate(['/tabs/books']);
      } else {
        // Si no está autenticado, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }
}
