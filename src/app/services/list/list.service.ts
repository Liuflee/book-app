import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from '@angular/fire/firestore';
import { List } from '../../models/list.model';  // Actualizado para apuntar al modelo correcto
import { Book } from '../../models/book.model';  // Importar el modelo de libro

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private listsCollection;

  constructor(private firestore: Firestore) {
    this.listsCollection = collection(this.firestore, 'lists');
  }

  // Obtener todas las listas
  async getLists(): Promise<List[]> {
    const listSnapshot = await getDocs(this.listsCollection);
    return listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as List));
  }

  // Obtener una lista por su ID junto con sus libros
  async getListById(listId: string): Promise<List | null> {
    const listRef = doc(this.firestore, 'lists', listId);
    const listSnapshot = await getDoc(listRef);
    if (listSnapshot.exists()) {
      return { id: listSnapshot.id, ...listSnapshot.data() } as List;
    } else {
      return null;
    }
  }

  // Crear una nueva lista
  async createList(name: string): Promise<List> {
    const newList: List = { name, books: [] };
    const docRef = await addDoc(this.listsCollection, newList);
    return { id: docRef.id, ...newList };
  }

  // Agregar libro a una lista
  async addBookToList(listId: string, book: Book): Promise<void> {
    const listRef = doc(this.firestore, 'lists', listId);
    await updateDoc(listRef, {
      books: arrayUnion(book)  // Usa arrayUnion para evitar duplicados
    });
  }

  // Eliminar lista
  async deleteList(listId: string): Promise<void> {
    const listRef = doc(this.firestore, 'lists', listId);
    await deleteDoc(listRef);
  }

  // src/app/services/list/list.service.ts
async removeBookFromList(listId: string, book: Book): Promise<void> {
  const listRef = doc(this.firestore, 'lists', listId);
  await updateDoc(listRef, {
    books: arrayRemove(book)  // Usa arrayRemove para eliminar el libro
  });
}

// src/app/services/list/list.service.ts
async renameList(listId: string, newName: string): Promise<void> {
  const listRef = doc(this.firestore, 'lists', listId);
  await updateDoc(listRef, { name: newName });
}

}
