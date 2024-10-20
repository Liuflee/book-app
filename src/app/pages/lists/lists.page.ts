import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list/list.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  lists: any[] = [];

  constructor(private listService: ListService, private alertCtrl: AlertController) { }

  async ngOnInit() {
    this.lists = await this.listService.getLists();  // Esperar a que se obtengan las listas
  }

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
              this.lists.push(newList);  // Agregar la nueva lista al estado local
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteList(listId: string) {
    await this.listService.deleteList(listId);
    this.lists = this.lists.filter(l => l.id !== listId);  // Eliminar localmente
  }
}
