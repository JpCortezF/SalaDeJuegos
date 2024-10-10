import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userEmailSubject = new BehaviorSubject<string | null>(null);
  public userEmail$ = this.userEmailSubject.asObservable(); // Observable para suscribirse
  
  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((authUser: User | null) => {
      if (authUser?.email) {
        this.userEmailSubject.next(authUser.email);
      } else {
        this.userEmailSubject.next(null);
      }
    });
  }

  // Devuelve el email del usuario autenticado o null si no está autenticado
  public userAuth(): string | null {
    return this.userEmailSubject.value;
  }

  private userEmail: string | null = null;

  setUserEmail(email: string) {
    this.userEmail = email;
  }

  getUserEmail() {
    return this.userEmail;
  }

  clearUserEmail() {
    this.userEmail = null;
  }

  async SaveScoreToFirebase(userEmail: any, score: number, listado_juego: string, firestore: Firestore): Promise<void> {
    const scoreData = {
      user: userEmail,
      score: score,
      fecha: new Date()
    }

    const col = collection(firestore, listado_juego);
    try {
      await addDoc(col, scoreData);
      console.log('Puntaje guardado en Firebase');
    } catch (error) {
      console.error('Error al guardar el puntaje:', error);
    }
  }
}
