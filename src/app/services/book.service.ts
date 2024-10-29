// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  apiKey = 'AIzaSyAiOVGb2OTiXWtF8AoEgxv48vzQSmwskmY';  

  constructor(private http: HttpClient) { }

  getBooks(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=${query}&key=${this.apiKey}`);
  }

}
