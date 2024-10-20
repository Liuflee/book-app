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

  constructor(private alertCtrl: AlertController, private quoteService: QuoteService) {}

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    const base64Image = image.base64String;

    // Pasar la imagen al reconocimiento de texto (OCR)
    if (base64Image) {
      this.extractTextFromImage(base64Image);
    } else {
      console.error('Failed to capture image');
    }
  }

  async extractTextFromImage(base64Image: string) {
    // Aquí se ejecuta el OCR con Tesseract.js
    const text = await this.runOCR(base64Image);
    this.extractedText = text;
  }

  async runOCR(base64Image: string): Promise<string> {
    try {
      // Llamada a Tesseract.js para realizar OCR
      const result = await Tesseract.recognize(
        `data:image/jpeg;base64,${base64Image}`,  // La imagen base64 en formato JPEG
        'spa',  // Idioma del OCR (puedes cambiarlo si es necesario)
        {
          logger: info => console.log(info),  // Opción para ver el progreso del reconocimiento
        }
      );
      return result.data.text;  // Devuelve el texto extraído
    } catch (error) {
      console.error('OCR error: ', error);
      return 'Error al extraer texto';
    }
  }

  async saveQuote() {
    const alert = await this.alertCtrl.create({
      header: 'Guardar cita',
      inputs: [
        {
          name: 'quote',
          type: 'textarea',
          value: this.extractedText,
          placeholder: 'Edita la cita extraída si es necesario'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.quote) {
              await this.quoteService.addQuote(data.quote);  // Guardar la cita en Firestore
              this.quotes.push(data.quote);  // Añadirla a la lista localmente
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async ngOnInit() {
    this.quotes = await this.quoteService.getQuotes();  // Obtener las citas guardadas
  }
}
