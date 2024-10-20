// src/app/models/list.model.ts
export interface List {
    id?: string;       // ID opcional (será generado por Firestore)
    title: string;     // Título de la lista
    description?: string; // Descripción opcional de la lista
    createdAt: Date;   // Fecha de creación
  }
  