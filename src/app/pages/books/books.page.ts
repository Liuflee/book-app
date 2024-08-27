import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  books: any[] = [];
  searchTerm: string = '';

  constructor(private bookService: BookService) { }

  ngOnInit() {
    // Cargar libros populares al iniciar la página
    this.loadBooks();
  }

  loadBooks(query: string = '') {
    // Si hay un término de búsqueda, ajusta la URL de la API
    let apiUrl = this.bookService.apiUrl;
    if (query) {
      apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=relevance&maxResults=10`;
    }

    // Realiza la solicitud a la API
    this.bookService.getBooks(apiUrl).subscribe((data: any) => {
      this.books = data.items;
    });
  }

  searchBooks(event: any) {
    const query = event.target.value.toLowerCase();
    if (query && query.trim() !== '') {
      this.loadBooks(query);
    } else {
      this.loadBooks();  // Si no hay búsqueda, carga los libros populares
    }
  }
}
