import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../services/list/list.service';
import { AlertController } from '@ionic/angular';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})

export class ListDetailsPage implements OnInit {
  listId: string | undefined;
  list: { name: string, books: Book[] } = { name: '', books: [] }; 

  constructor(private route: ActivatedRoute, private listService: ListService, private alertCtrl: AlertController, private router: Router) { }

  async ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listId')!; 
    const list = await this.listService.getListById(this.listId); 
    if (list) {
      this.list = list;
    }
  }

  async confirmRemoveBook(book: Book) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${book.title}" de la lista?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.removeBook(book); 
          }
        }
      ]
    });

    await alert.present();
  }

  async removeBook(book: Book) {
    if (this.listId) {
      await this.listService.removeBookFromList(this.listId, book); 
    }
    this.list.books = this.list.books.filter(b => b.id !== book.id); 
  }

  goBack() {
    this.router.navigate(['/tabs/lists']); 
  } 

  async renameList() {
    const alert = await this.alertCtrl.create({
      header: 'Renombrar lista',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          value: this.list.name, 
          placeholder: 'Nuevo nombre de la lista'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Renombrar',
          handler: async (data) => {
            if (data.newName) {
              if (this.listId) {
                await this.listService.renameList(this.listId, data.newName);
              }
              this.list.name = data.newName; 
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}
