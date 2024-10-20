import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private quotesCollection;

  constructor(private firestore: Firestore) {
    this.quotesCollection = collection(this.firestore, 'quotes');  // Colección en Firestore para citas
  }

  // Crear una nueva cita
  async addQuote(quote: string) {
    const newQuote = { text: quote, date: new Date() };
    await addDoc(this.quotesCollection, newQuote);
    return newQuote;
  }

  // Obtener todas las citas
  async getQuotes() {
    const quoteSnapshot = await getDocs(this.quotesCollection);
    return quoteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Eliminar una cita
  async deleteQuote(id: string) {
    const quoteDoc = doc(this.firestore, 'quotes', id);
    return await deleteDoc(quoteDoc);
  }

  // Puedes agregar métodos adicionales, como editar citas, etc.
}
