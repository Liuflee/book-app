export interface List {
    id?: string;  // ID opcional, se asignará automáticamente
    name: string;
    books: any[];  // O define un modelo más específico para los libros
  }
  