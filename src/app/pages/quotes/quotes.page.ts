import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { QuoteService } from '../../services/quote/quote.service';
import * as Tesseract from 'tesseract.js';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage {

  extractedText: string = '';
  quotes: any[] = [];
  isEditingExtractedText: boolean = false;

  constructor(private alertCtrl: AlertController, private quoteService: QuoteService) {}

  async selectImage() {
    if (Capacitor.isNativePlatform()) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt 
      });

      const base64Image = image.base64String;

      if (base64Image) {
        this.extractTextFromImage(base64Image);
      } else {
        console.error('Error al seleccionar imagen');
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const base64Image = await this.convertFileToBase64(file);
          this.extractTextFromImage(base64Image);
        }
      };
      input.click();
    }
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }

  async extractTextFromImage(base64Image: string) {
    const text = await this.runOCR(base64Image);
    this.extractedText = text;
  }

  async runOCR(base64Image: string): Promise<string> {
    try {
      const result = await Tesseract.recognize(
        `data:image/jpeg;base64,${base64Image}`,
        'spa', 
        {
          logger: info => console.log(info),
        }
      );
      return result.data.text;
    } catch (error) {
      console.error('Error de OCR: ', error);
      return 'Error al extraer texto';
    }
  }

  async saveQuote(quoteText: string) {
    if (quoteText) {
      await this.quoteService.addQuote(quoteText);
      this.updateQuotesList();
      this.extractedText = ''; 
    }
  }

  async deleteQuote(quoteId: string) {
    await this.quoteService.deleteQuote(quoteId);
    this.updateQuotesList();
  }

  updateQuotesList() {
    this.quoteService.getQuotes().then((quotes) => {
      this.quotes = quotes.map(q => ({...q, isEditing: false}));
    }).catch((error) => {
      console.error('Error al actualizar las citas: ', error);
    });
  }

  async ngOnInit() {
    this.updateQuotesList();
  }

  toggleEditQuote(quote: any) {
    quote.isEditing = !quote.isEditing;
  }

  async updateQuote(quote: any) {
    if (quote.text) {
      await this.quoteService.updateQuote(quote.id, quote.text);
      quote.isEditing = false;
    }
  }

  async confirmDeleteQuote(quoteId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta cita?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Eliminación cancelada')
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.quoteService.deleteQuote(quoteId);
            this.updateQuotesList();
          }
        }
      ]
    });

    await alert.present();
  }
}
