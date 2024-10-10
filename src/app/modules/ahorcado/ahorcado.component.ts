import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit {
  encabezado = "";
  userEmail: string | null = "";
  palabras: string[] = ["Gabinete", "Componente", "Lapicero", "Enunciado", "Movida", "Diablo", "Cargador", "Lampara", "Artista", "Conjunto", "Campeon", "Galleta", "Microfono", "Internet", "Elegante", "Grabacion", "Escenario", "Gato", "Martillo", "Canino", "Mesa", "Helicoptero", "Elefante", "Computadora", "Ventana", "Television", "Avion", "Reloj", "Teléfono", "Espejo", "Montaña", "Camara", "Escultura", "Leon", "Cine", "Ratón", "Rinoceronte", "Teclado", "Maletin", "Refrigerador", "Libro", "Playa", "Alfombra", "Perro", "Silla", "Sol", "Globo", "Robot", "Pintura", "Sombrero", "Taza", "Cocina", "Puerta", "Tren", "Papel", "Avellana", "Escoba", "Barco", "Frigorifico", "Zorro", "Bicicleta", "Anillo", "Estuche"];
  palabraActual: string = "";
  palabraOculta: string = "";
  intento = 0;
  score: number = 0;
  gameOver: boolean = false;

  letras: string[] = [];
  usadas: string[] = [];

  constructor(private userService: UserService, private firestore: Firestore){}

  ngOnInit(): void {
    this.userEmail = this.userService.userAuth();
  }

  PalabraAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.palabras.length);
    this.palabraActual = this.palabras[indiceAleatorio];
    console.log(this.palabraActual);
  }

  NuevoJuego() {
    
    this.PalabraAleatoria(); 

    this.palabraOculta = "___ ".repeat(this.palabraActual.length);
    
    this.encabezado = "Juego del Ahorcado";
    this.intento = 0;
    this.gameOver = false;
    this.letras = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
      'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R',
      'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    this.usadas = [];
  }

  TecladoLetras(letra: string){
    if (!this.palabraActual.toUpperCase().includes(letra)) {
      this.intento++;
      if (this.intento >= 8) {
        this.gameOver = true;
        this.encabezado = "Has perdido, la palabra era: " + this.palabraActual;
        this.userEmail = this.userEmail!.split('@')[0];
        this.userService.SaveScoreToFirebase(this.userEmail, this.score, 'listado_ahorcado', this.firestore);
      }
    }else {
      // revela la letra en la palabra
      let palabraOcultaArr = this.palabraOculta.split(' ');
      for (let i = 0; i < this.palabraActual.length; i++) {
        if (this.palabraActual[i].toUpperCase() === letra) {
          palabraOcultaArr[i] = letra;
        }
      }
      this.palabraOculta = palabraOcultaArr.join(' ');

      if (!this.palabraOculta.includes('_')) {
        this.gameOver = true;
        this.encabezado = "¡Ganaste!";
        this.score++;
      }
    }
  
    this.usadas.push(letra);
  }

}
