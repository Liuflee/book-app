import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { List } from '../../models/list.model';  // Asegúrate de definir el modelo List

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private listsCollection;

  constructor(private firestore: Firestore) {
    this.listsCollection = collection(this.firestore, 'lists');
  }

  // Obtener todas las listas
  async getLists() {
    const listSnapshot = await getDocs(this.listsCollection);
    return listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Crear una nueva lista
  async createList(name: string) {
    const newList: List = { name, books: [] };
    const docRef = await addDoc(this.listsCollection, newList);
    return { id: docRef.id, ...newList };
  }

  // Agregar libro a una lista
  async addBookToList(listId: string, book: any) {
    const listRef = doc(this.firestore, 'lists', listId);
    // Actualizar el libro en la lista
    await updateDoc(listRef, {
      books: arrayUnion(book)  // Usa arrayUnion para evitar duplicados
    });
  }

  // Eliminar lista
  async deleteList(listId: string) {
    const listRef = doc(this.firestore, 'lists', listId);
    await deleteDoc(listRef);
  }
}
