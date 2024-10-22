// src/app/models/book.model.ts
export interface Book {
    id?: string; // El ID del libro, opcional para crear un nuevo libro
    title: string;
    author: string;
    imageUrl: string;
    description?: string; // Este campo puede ser opcional
  }
  