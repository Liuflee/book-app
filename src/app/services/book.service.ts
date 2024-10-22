// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // URL base de la API de Google Books
  apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  apiKey = 'AIzaSyAiOVGb2OTiXWtF8AoEgxv48vzQSmwskmY';  // Asegúrate de reemplazar con tu clave API

  constructor(private http: HttpClient) { }

  // Método para obtener libros desde Google Books
  getBooks(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${query}&key=${this.apiKey}`);
  }

}
