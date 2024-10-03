import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit{
  encabezado = "";
  palabras: string [] = ["Gabinete", "Componente", "Lapicero", "Enunciado", "Movida", "Diablo", "Cargador", "Lampara", "Artista", "Conjunto", "Campeon", "Galleta", "Microfono", "Internet", "Elegante", "Grabacion", "Escenario", "gato", "martillo", "canino", "mesa", "helicóptero", "elefante", "computadora", "ventana", "televisión"];
  palabraActual: string = "";
  palabraOculta: string = "";
  intento = 0;
  puntaje = 0;
  gameOver: boolean = false;

  letras: string[] = [];
  usadas: string[] = [];

  constructor(public auth: Auth, private router: Router){}

  ngOnInit(): void{
    this.auth.onAuthStateChanged((auth)=>{
      if(auth?.email){
        this.encabezado = "Juego del ahorcado!";
      }else{
        this.router.navigate(['/log-in']);
      }
    })
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
      'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
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
      }
    }
  
    this.usadas.push(letra);
  }

}
