import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-deftionary',
  templateUrl: './deftionary.component.html',
  styleUrls: ['./deftionary.component.scss']
})
export class DeftionaryComponent {
  encabezado = "";
  juegoIniciado: boolean = false;
  palabras: string[] = [
    'gato', 'martillo', 'canino', 'mesa', 'helicóptero', 'elefante', 'computadora', 'ventana', 'televisión', 
    'ciudad', 'zapato', 'espejo', 'cámara', 'teléfono', 'piedra', 'camisa', 'ratón', 'teclado', 
    'lámpara', 'escalera', 'cohete', 'montaña', 'barco', 'planeta', 'estrella', 'bosque', 'libro',
    'tigre', 'león', 'moto', 'auto', 'tren', 'puerta', 'reloj', 'sol', 'luna', 'mar', 'río',
    'auricular', 'silla', 'caballo', 'madera', 'gallina', 'lápiz', 'pluma', 'pájaro', 'cielo', 'flor',
    'árbol', 'casa', 'banco', 'balde', 'mercado', 'pan', 'queso', 'leche', 'café', 'azúcar',
    'sal', 'pimienta', 'fruta', 'nube', 'trueno', 'relámpago', 'pelota', 'vaso', 'billetera', 'jirafa'
  ];
  palabraElegida: string = '';
  definicion: string = '';
  mensaje: string = '';
  definicionCorrecta: boolean = false;
  remainingLives: number = 3;
  score: number = 0;
  txtButton = "";

  constructor(private http: HttpClient) {
    this.GenerarPalabraAleatoria();
  }

  IniciarJuego() {
    this.juegoIniciado = true;
    this.GenerarPalabraAleatoria();
  }
  
  GenerarPalabraAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.palabras.length);
    this.palabraElegida = this.palabras[indiceAleatorio];
    console.log(this.palabraElegida);
    this.definicionCorrecta = false;
    this.ObtenerDefinicion(this.palabraElegida);
    this.mensaje = '';
    this.txtButton = "Verificar";
  }

  ObtenerDefinicion(palabra: string) {
    const url = `https://es.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${palabra}&explaintext=true`;

    this.http.get<any>(url).subscribe((response) => {
      const pages = response.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      this.definicion = this.LimpiarDefinicion(extract);
      this.encabezado = "Definición";
    }, (error) => {
      console.error('Error al obtener la definición:', error);
    });
  }

  LimpiarDefinicion(extract: string): string {
    const regex = /\n1\s([\s\S]+?)(?=\n[2-9]|\n={2,}|\n==)/;
    const match = extract.match(regex);
    if (match) {
      // Obtener el texto de la definición
      let definicion = match[1];

      definicion = definicion
          .split(/Ejemplo:|Sinónimos:|Sinónimo:|macho:|Hiperónimo:|Hiperónimos:/)[0]
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(); 

      return definicion;
  }

  return '';
  }

  VerificarRespuesta(inputPalabra: string, inputElement: HTMLInputElement) {
    if (this.txtButton === "Reiniciar") {
      this.remainingLives = 3;
      this.score = 0;
      this.GenerarPalabraAleatoria();
      inputElement.value = '';
      this.txtButton = "Verificar";
      return;
    }

    if(this.definicionCorrecta || this.txtButton === "Siguiente palabra"){
      this.GenerarPalabraAleatoria();
      inputElement.value = '';
    }else{
      const respuestaNormalizada = this.NormalizarTexto(inputPalabra);
      const palabraNormalizada = this.NormalizarTexto(this.palabraElegida);
  
      if (respuestaNormalizada === palabraNormalizada) {
        this.definicionCorrecta = true;
        this.encabezado = "¡Correcto!";
        this.txtButton = "Siguiente palabra";
        this.score++;
      } else {
        this.remainingLives -= 1;
        this.encabezado = "¡Incorrecto!";
        this.mensaje = 'La palabra era ' + this.palabraElegida;
        this.txtButton = "Siguiente palabra";
        if (this.remainingLives == 0) {
          this.mostrarMensajePerdida(inputElement);
          this.remainingLives = 3;
          this.score = 0;
        }
      }
    }    
  }

  NormalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  mostrarMensajePerdida(inputElement: HTMLInputElement) {
    Swal.fire({
      title: '¡Perdiste!',
      text: 'La palabra era ' + this.palabraElegida,
      icon: 'error',
      confirmButtonText: 'Reiniciar'
    }).then(() => {
      this.remainingLives = 3;
      this.score = 0;
      this.GenerarPalabraAleatoria();
      inputElement.value = '';
      this.txtButton = "Verificar";
    });
  }
}