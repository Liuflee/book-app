import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Asegúrate de tener HttpClientModule importado
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  // Otros campos que tu backend retorne
}

interface RegisterResponse {
  message: string; // O cualquier otro campo que tu backend retorne
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://tu-backend-api.com/api'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponse>(url, body, { headers }).pipe(
      map(response => {
        // Aquí puedes procesar la respuesta si es necesario
        return response;
      })
    );
  }

  // Método de registro
  register(username: string, password: string): Observable<RegisterResponse> {
    const url = `${this.apiUrl}/register`; // Asegúrate de que esta sea la ruta correcta para tu backend
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<RegisterResponse>(url, body, { headers }).pipe(
      map(response => {
        // Procesar la respuesta si es necesario
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Si utilizas otras formas de almacenamiento, límpialas también
  }

  resetPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/reset-password`;
    const body = { email };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers });
  }
}
