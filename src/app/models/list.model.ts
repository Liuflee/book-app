import { Book } from "./book.model";

export interface List {
    id?: string;  // ID opcional, se asignará automáticamente
    name: string;
    books: Book[];  // O define un modelo más específico para los libros
  }
  