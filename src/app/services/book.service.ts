import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  public apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=10';

  constructor(private http: HttpClient) {}

  getBooks(apiUrl: string = this.apiUrl): Observable<any> {
    return this.http.get<any>(apiUrl);
  }
}
