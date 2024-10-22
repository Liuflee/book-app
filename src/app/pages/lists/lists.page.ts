import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {
  lists: any[] = [];

  constructor(private listService: ListService, private alertCtrl: AlertController, private router: Router) { }

  async ngOnInit() {
    await this.refreshLists();  // cargar las listas al iniciar
  }

  async refreshLists() {
    this.lists = await this.listService.getLists();  // esperar a que se obtengan las listas
  }

  // Metodo para crear una nueva lista 
  async createList() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva lista',
      inputs: [
        {
          name: 'name',
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
            if (data.name) {
              const newList = await this.listService.createList(data.name);
              this.lists.push(newList);  
            }
          }
        }
      ]
    });

    await alert.present();
  }

  openListDetails(listId: string) {
    this.router.navigate(['/list-details', listId]);  
  }

  async deleteList(listId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.listService.deleteList(listId);
            this.lists = this.lists.filter(l => l.id !== listId);  
          }
        }
      ]
    });

    await alert.present();
  }
}
