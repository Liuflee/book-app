import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ListService } from '../../services/list/list.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  books: any[] = [];
  searchTerm: string = '';
  lists: any[] = [];

  constructor(private bookService: BookService, private listService: ListService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loadBooks();
    this.lists = this.listService.getLists();  // Cargar listas de libros
  }

  loadBooks(query: string = '') {
    this.bookService.getBooks(query).subscribe((data: any) => {
      this.books = data.docs;
    });
  }

  searchBooks(event: any) {
    const query = event.target.value.toLowerCase();
    this.loadBooks(query);
  }

  async addBookToList(book: any) {
    const alert = await this.alertCtrl.create({
      header: 'Añadir a lista',
      inputs: this.lists.map(list => ({
        type: 'radio',
        label: list.name,
        value: list.id
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Añadir',
          handler: (listId) => {
            if (listId) {
              this.listService.addBookToList(listId, book);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
