// list.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private lists: any[] = [];

  constructor() {}

  // Obtener todas las listas
  getLists() {
    return this.lists;
  }

  // Crear una nueva lista
  createList(name: string) {
    const newList = { id: Date.now(), name, books: [] };
    this.lists.push(newList);
    return newList;
  }

  // Agregar libro a una lista
  addBookToList(listId: number, book: any) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      list.books.push(book);
    }
  }

  // Eliminar lista
  deleteList(listId: number) {
    this.lists = this.lists.filter(l => l.id !== listId);
  }
}
