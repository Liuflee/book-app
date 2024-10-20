// lists.page.ts
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

  ngOnInit() {
    this.lists = this.listService.getLists();
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
          handler: (data) => {
            if (data.name) {
              this.listService.createList(data.name);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteList(listId: number) {
    this.listService.deleteList(listId);
  }
}
