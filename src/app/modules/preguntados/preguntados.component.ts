import { Component, OnInit } from '@angular/core';
import { QuizContestService } from '../../services/quiz-contest.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

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
  timeLeft: number = 30;
  currentQuestionIndex: number = 0;
  questions: any[] = [];
  showNextButton: boolean = false;
  selectedAnswer: string = '';
  isAnswered: boolean = false;

  private categories = [
    'geography',
    'history',
    'sports%26leisure',
    'entertainment'
  ]

  constructor(public auth: Auth, private router: Router, private quizService: QuizContestService){}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((auth)=>{
      if(auth?.email){
        this.LoadQuestions();
        this.encabezado = "Preguntados";
      }else{
        this.router.navigate(['/log-in']);
      } 
    })
  }

  LoadQuestions(): void {
    let page = Math.floor(Math.random() * 3) + 1;
    let randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];

    this.quizService.getQuestions(1, page, randomCategory, 'multiple').subscribe({
      next: (data) => {
        if (data && data.questions.length > 0) {
          this.questions = data.questions;
          this.LoadNextQuestion();
        }else {
          console.error('La respuesta de la API no contiene preguntas.');
        }
        console.log(this.questions);
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
      }
    });
  }

  LoadNextQuestion(): void {
      if(this.questions.length > 0){
        this.showNextButton = false;
        this.isAnswered = false; 
        this.currentQuestion = this.questions[0];
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

  onAnswerClick(selectedAnswer: string): void {
    if (this.isAnswered) return;

    this.selectedAnswer = selectedAnswer;
    this.isAnswered = true;  

    if (selectedAnswer === this.correctAnswer) {
      this.showNextButton = true;
    } else {
      this.showNextButton = true;
      this.remainingLives--;    
    }
  }

  resetGame(): void {
    this.currentQuestionIndex = 0;
    this.remainingLives = 3;
    this.LoadQuestions();
  }

  // Función para mezclar las respuestas
  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
