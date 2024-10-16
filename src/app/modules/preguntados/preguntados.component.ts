import { Firestore } from '@angular/fire/firestore';
import { QuizContestService } from '../../services/quiz-contest.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit{
  encabezado: string = "";
  currentCategory: string = '';
  currentQuestion: any;
  allAnswers: string[] = [];
  correctAnswer: string = '';
  remainingLives: number = 3;
  score: number = 0;
  timeLeft: number = 30;
  currentQuestionIndex: number = 0;
  questions: any[] = [];
  showNextButton: boolean = false;
  selectedAnswer: string = '';
  isAnswered: boolean = false;
  userEmail: string | null = "";
  user: string = "";
  gameMode: string = '';
  gameModeSelected: boolean = false;
  currentFlagUrl: string = '';

  private categories = [
    'geography',
    'history',
    'sports%26leisure',
    'entertainment'
  ]

  constructor(private router: Router, private quizService: QuizContestService, private userService: UserService, private firestore: Firestore, private http: HttpClient){}

  ngOnInit(): void {
    this.userEmail = this.userService.userAuth();
    if(this.userEmail){
      this.user = this.userEmail.split('@')[0];
    }
  }

  selectGameMode(mode: string): void {
    this.gameMode = mode;
    this.gameModeSelected = true;
    this.LoadQuestions();
  }
  
  LoadQuestions(): void {
    if (this.gameMode === 'trivia') {
      this.LoadTriviaQuestions();
    } else if (this.gameMode === 'flags') {
      this.LoadFlagQuestion();
    }
  }

  LoadTriviaQuestions(): void {
    let page = Math.floor(Math.random() * 2) + 1;
    let randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
    
    this.quizService.getQuestions(15, page, randomCategory, 'multiple').subscribe({
      next: (data) => {
        if (data && data.questions.length > 0) {
          this.questions = data.questions;
          this.LoadNextQuestion();
        } else {
          console.error('La respuesta de la API no contiene preguntas.');
        }
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
      }
    });
  }

  LoadFlagQuestion(): void {
    this.http.get('https://restcountries.com/v3.1/all').subscribe({
      next: (data: any) => {
        const randomCountry = data[Math.floor(Math.random() * data.length)];
        this.currentFlagUrl = randomCountry.flags.svg;
        this.correctAnswer = randomCountry.translations.spa.common;
        
        const incorrectCountries = this.getRandomIncorrectCountries(data, randomCountry);
        this.allAnswers = [...incorrectCountries, this.correctAnswer];
        this.allAnswers = this.shuffle(this.allAnswers);
        this.showNextButton = false;
        this.isAnswered = false;
      },
      error: (error) => {
        console.error('Error al cargar la bandera:', error);
      }
    });
  }

  LoadNextQuestion(): void {
      if(this.questions.length > 0){
        let index = Math.floor(Math.random() * this.questions.length);
        this.showNextButton = false;
        this.isAnswered = false;
        this.currentQuestion = this.questions[index];
        console.log(this.currentQuestion.correctAnswers);
        switch(this.currentQuestion.category)
        {
          case 'geography':
            this.currentCategory = "Geografia";
            break;
          case 'history':
            this.currentCategory = "Historia";
            break;
          case 'sports&leisure':
            this.currentCategory = "Deportes";
            break;
          case 'entertainment':
            this.currentCategory = "Entretenimiento";
            break;
          default:
            this.currentCategory = "Preguntados";
        }
        this.correctAnswer = this.currentQuestion.correctAnswers;
        this.allAnswers = [...this.currentQuestion.incorrectAnswers, this.correctAnswer];
        this.allAnswers = this.shuffle(this.allAnswers);
        this.currentQuestionIndex++;
      }        
  }

  getRandomIncorrectCountries(allCountries: any[], correctCountry: any): string[] {
    const incorrectCountries = [];
    while (incorrectCountries.length < 3) {
      const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
      if (randomCountry.translations.spa.common !== correctCountry.translations.spa.common) {
        incorrectCountries.push(randomCountry.translations.spa.common);
      }
    }
    return incorrectCountries;
  }

  onAnswerClick(selectedAnswer: string): void {
    if (this.isAnswered) return;

    this.selectedAnswer = selectedAnswer;
    this.isAnswered = true;  

    if (selectedAnswer === this.correctAnswer) {
      this.showNextButton = true;
      this.score++;
    } else {
      this.showNextButton = true;
      this.remainingLives--;

      if(this.remainingLives == 0){
        this.userService.SaveScoreToFirebase(this.user, this.score, 'listado_preguntados', this.firestore).then(() => {
          this.showGameOverAlert();
        });
      }   
    }
  }

  resetGame(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.remainingLives = 3;
    this.LoadQuestions();
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  showGameOverAlert(): void {
    Swal.fire({
      title: '¡Te quedaste sin vidas!',
      text: "¿Quieres reiniciar el juego o salir?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reiniciar',
      cancelButtonText: 'Salir',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetGame();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/']);
      }
    });
  }
}
