import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ListService } from '../../services/list/list.service';
import { AlertController, AlertInput } from '@ionic/angular';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {
  books: Book[] = [];
  searchTerm: string = '';
  lists: any[] = [];

  constructor(
    private bookService: BookService,
    private listService: ListService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const defaultQuery = 'programming';
    this.loadBooks(defaultQuery);
    this.loadLists(); // Cargar listas de libros al inicio
  }

  async loadLists() {
    this.lists = await this.listService.getLists();
  }

  loadBooks(query: string = '') {
    this.bookService.getBooks(query).subscribe((data: any) => {
      this.books = data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Desconocido',
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || '',
        description: item.volumeInfo.description || ''
      })) || [];
    });
  }
  
  searchBooks(event: any) {
    const query = event.target.value.toLowerCase();
    this.loadBooks(query);
  }

  async addBookToList(book: Book) {
    const inputs: AlertInput[] = this.lists.map(list => ({
      type: 'radio' as const,
      label: list.name,
      value: list.id
    }));

    inputs.push({
      type: 'radio' as const,
      label: 'Crear nueva lista',
      value: 'createNew'
    });

    const alert = await this.alertCtrl.create({
      header: 'Añadir a lista',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Añadir',
          handler: async (selectedValue) => {
            if (selectedValue) {
              if (selectedValue === 'createNew') {
                await this.promptCreateNewList(book); // Ofrecer crear una nueva lista
              } else {
                await this.listService.addBookToList(selectedValue, book); // Añadir el libro a la lista seleccionada
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async promptCreateNewList(book: Book) {
    const alert = await this.alertCtrl.create({
      header: 'Crear nueva lista',
      inputs: [
        {
          name: 'listName',
          type: 'text',
          placeholder: 'Nombre de la lista'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (data.listName && data.listName.trim() !== '') {
              const newList = await this.listService.createList(data.listName); // Crear la lista
              this.lists.push(newList); // Agregar la nueva lista a la lista local
              if (newList.id) {
                await this.listService.addBookToList(newList.id, book); // Añadir el libro a la nueva lista
              } else {
                // Handle the case where newList.id is undefined
                this.alertCtrl.create({
                  header: 'Error',
                  message: 'No se pudo crear la lista. Inténtalo de nuevo.',
                  buttons: ['Aceptar']
                }).then(alert => alert.present());
              }
            } else {
              // Si el nombre de la lista está vacío, mostrar un mensaje de error
              this.alertCtrl.create({
                header: 'Error',
                message: 'El nombre de la lista no puede estar vacío.',
                buttons: ['Aceptar']
              }).then(alert => alert.present());
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
