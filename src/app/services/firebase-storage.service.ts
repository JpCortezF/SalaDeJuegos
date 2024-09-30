import { Injectable } from '@angular/core';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor() { }

  getImageUrl(imageName: string): Promise<string> {
    const storage = getStorage();
    const imageRef = ref(storage, `${imageName}`);
    return getDownloadURL(imageRef);
  }

  // Método para obtener múltiples imágenes
  getImageUrls(imageNames: string[]): Promise<{ [key: string]: string }> {
    const promises = imageNames.map(imageName => this.getImageUrl(imageName));
    return Promise.all(promises).then(urls => {
      const result: { [key: string]: string } = {};
      imageNames.forEach((imageName, index) => {
        result[imageName] = urls[index];
      });
      return result;
    });
  }
}