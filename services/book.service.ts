// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Cambia la URL base de la API a Open Library
  apiUrl = 'https://openlibrary.org/search.json?';

  constructor(private http: HttpClient) { }

  // Método para obtener libros
  getBooks(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}q=${query}`);
  }
}
