import { addDoc, collection, collectionData, Firestore, where, orderBy, limit, query, doc, setDoc } from '@angular/fire/firestore';
import { QuizContestService } from '../../services/quiz-contest.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 

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

  private categories = [
    'geography',
    'history',
    'sports%26leisure',
    'entertainment'
  ]

  constructor(private router: Router, private quizService: QuizContestService, private userService: UserService, private firestore: Firestore){}

  ngOnInit(): void {
    this.userEmail = this.userService.userAuth();
    if(this.userEmail){
      this.LoadQuestions();
      this.user = this.userEmail.split('@')[0];
    }
  }

  LoadQuestions(): void {
    let page = Math.floor(Math.random() * 2) + 1;
    let randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
    
    this.quizService.getQuestions(15, page, randomCategory, 'multiple').subscribe({
      next: (data) => {
        if (data && data.questions.length > 0) {
          this.questions = data.questions;
          this.LoadNextQuestion();
        }else {
          console.error('La respuesta de la API no contiene preguntas.');
        }
      },
      error: (error) => {
        console.error('Error al obtener las preguntas:', error);
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
