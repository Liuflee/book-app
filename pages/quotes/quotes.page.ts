import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { QuoteService } from '../../services/quote/quote.service';  
import * as Tesseract from 'tesseract.js';  // Importa Tesseract.js

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage {

  extractedText: string = '';  // Donde se mostrará el texto extraído
  quotes: any[] = [];  // Guardar las citas obtenidas de Firestore
  isEditingExtractedText: boolean = false;  // Indica si el texto extraído está siendo editado

  constructor(private alertCtrl: AlertController, private quoteService: QuoteService) {}

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    const base64Image = image.base64String;

    if (base64Image) {
      this.extractTextFromImage(base64Image);
    } else {
      console.error('Failed to capture image');
    }
  }

  async extractTextFromImage(base64Image: string) {
    const text = await this.runOCR(base64Image);
    this.extractedText = text;
  }

  async runOCR(base64Image: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(
        `data:image/jpeg;base64,${base64Image}`,  // La imagen base64 en formato JPEG
        'spa',  // Idioma del OCR
        {
          logger: info => console.log(info),  // Progreso del OCR
        }
      );
      return result.data.text;  // Devuelve el texto extraído
    } catch (error) {
      console.error('OCR error: ', error);
      return 'Error al extraer texto';
    }
  }

  async saveQuote(quoteText: string) {
    if (quoteText) {
      await this.quoteService.addQuote(quoteText);  // Guardar en Firestore
      this.updateQuotesList();
      this.extractedText = '';  // Limpiar el texto extraído
    }
  }

  async deleteQuote(quoteId: string) {
    await this.quoteService.deleteQuote(quoteId);  // Eliminar cita de Firestore
    this.updateQuotesList();
  }

  updateQuotesList() {
    this.quoteService.getQuotes().then((quotes) => {
      this.quotes = quotes.map(q => ({...q, isEditing: false}));  // Añadir el campo isEditing
    }).catch((error) => {
      console.error('Error al actualizar las citas: ', error);
    });
  }

  async ngOnInit() {
    this.updateQuotesList();
  }

  toggleEditQuote(quote: any) {
    quote.isEditing = !quote.isEditing;  // Alternar el modo de edición
  }

  async updateQuote(quote: any) {
    if (quote.text) {
      await this.quoteService.updateQuote(quote.id, quote.text);  // Actualizar la cita en Firestore
      quote.isEditing = false;  // Salir del modo de edición
    }
  }

  // En quotes.page.ts
  async confirmDeleteQuote(quoteId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta cita?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si el usuario presiona "Cancelar", no hacemos nada
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Si el usuario confirma la eliminación, llamamos al servicio para eliminar la cita
            await this.quoteService.deleteQuote(quoteId);
            this.updateQuotesList();  // Actualiza la lista de citas
          }
        }
      ]
    });

    await alert.present();
  }

}
