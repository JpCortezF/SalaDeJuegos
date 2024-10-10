import { Component, OnInit } from '@angular/core';
import { FirebaseStorageService } from '../../services/firebase-storage.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss']
})
export class MayorMenorComponent implements OnInit {
  encabezado = "";
  userEmail: string | null = "";
  user: string = "";
  cartas: string[] = [
    '1oro', '2oro', '3oro', '4oro', '5oro', '6oro', '7oro', '8oro', '9oro', '10oro',
    '1copa', '2copa', '3copa', '4copa', '5copa', '6copa', '7copa', '8copa', '9copa', '10copa',
    '1espada', '2espada', '3espada', '4espada', '5espada', '6espada', '7espada', '8espada', '9espada', '10espada',
    '1basto', '2basto', '3basto', '4basto', '5basto', '6basto', '7basto', '8basto', '9basto', '10basto'
  ];
  
  imageUrls: { [key: string]: string } = {};
  currentCardUrl: string | null = null;
  currentCard: string | null = null;
  score: number = 0;
  gameOver: boolean = false;

  constructor(private firebaseStorageService: FirebaseStorageService, private userService: UserService, private router: Router, private firestore: Firestore) {}

  ngOnInit(): void {
    this.userEmail = this.userService.userAuth();
    if(this.userEmail){
      this.LoadImages();
      this.user = this.userEmail.split('@')[0];
      console.log(this.user);
    }
  }

  LoadImages(): void {
    this.cartas.forEach(carta => {
      this.firebaseStorageService.getImageUrl(`${carta}.png`).then(url => {
        this.imageUrls[carta] = url;
      }).catch(error => {
        console.error(`Error al cargar la imagen ${carta}:`, error);
      });
    });
  }

  StartGame(): void {
    if (this.cartas.length === 0) {
      this.gameOver = true;
      alert(`Juego terminado! Puntuación: ${this.score}`);
      return;
    }
    this.score = 0;
    this.gameOver = false;
    this.GetRandomCard();
  }

  GetRandomCard(): void {
    const randomIndex = Math.floor(Math.random() * this.cartas.length);
    const randomCard = this.cartas[randomIndex];
    this.currentCardUrl = this.imageUrls[randomCard] || null;
    this.currentCard = randomCard;
    this.cartas.splice(randomIndex, 1); // Eliminar la carta para que no se repita
  }

  GuessMayor(): void {
    if (!this.currentCard || this.cartas.length === 0 || this.gameOver) return;

    const previousCard = this.currentCard;
    this.GetRandomCard();

    if (this.CompareCards(this.currentCard!, previousCard) >= 0) {
      this.score++;
    } else {
      this.gameOver = true;
      this.encabezado = "Perdiste!";
      this.userService.SaveScoreToFirebase(this.user, this.score, 'listado_mayor-menor', this.firestore);
    }
  }

  GuessMenor(): void {
    if (!this.currentCard || this.cartas.length === 0 || this.gameOver) return;

    const previousCard = this.currentCard;
    this.GetRandomCard();

    if (this.CompareCards(this.currentCard!, previousCard) <= 0) {
      this.score++;
    } else {
      this.gameOver = true;
      this.encabezado = "Perdiste!";
    }
  }

  CompareCards(carta1: string, carta2: string): number {
    const valor1 = parseInt(carta1);
    const valor2 = parseInt(carta2);
    return valor1 - valor2;
  }

  RestartGame(): void {
    let cartasCopia: string[] = [
      '1oro', '2oro', '3oro', '4oro', '5oro', '6oro', '7oro', '8oro', '9oro', '10oro',
      '1copa', '2copa', '3copa', '4copa', '5copa', '6copa', '7copa', '8copa', '9copa', '10copa',
      '1espada', '2espada', '3espada', '4espada', '5espada', '6espada', '7espada', '8espada', '9espada', '10espada',
      '1basto', '2basto', '3basto', '4basto', '5basto', '6basto', '7basto', '8basto', '9basto', '10basto'
    ];

    this.encabezado = "Juego Mayor-Menor";
    this.cartas = cartasCopia;
    this.currentCardUrl = null;
    this.score = 0;
    this.gameOver = false;
  }
}