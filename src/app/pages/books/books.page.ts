import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ListService } from '../../services/list/list.service';
import { AlertController, AlertInput } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
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
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const defaultQuery = 'programming';
    this.loadBooks(defaultQuery);
    this.loadLists(); 
    
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
        //cambiar http por https
        imageUrl: item.volumeInfo.imageLinks?.thumbnail.replace('http://', 'https://') || '',
        description: item.volumeInfo.description || ''
      })) || [];
    });

    // imprimir la url de la imagen de cada libro
  }
  
  getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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
                await this.promptCreateNewList(book); 
              } else {
                await this.listService.addBookToList(selectedValue, book); 
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
              const newList = await this.listService.createList(data.listName); 
              this.lists.push(newList); 
              if (newList.id) {
                await this.listService.addBookToList(newList.id, book);
              } else {
                
                this.alertCtrl.create({
                  header: 'Error',
                  message: 'No se pudo crear la lista. Inténtalo de nuevo.',
                  buttons: ['Aceptar']
                }).then(alert => alert.present());
              }
            } else {
              
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
