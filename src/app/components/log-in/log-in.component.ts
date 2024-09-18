import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  newUserMail: string = "";
  newUserPass: string = "";

  userLogged: string = "";
  flagError: boolean = false;
  messageError: string = "";

  userMail: string = "";
  userPass: string = "";
  isRegistering = false;

  constructor(public auth: Auth, private router: Router) {}

  ToggleForm() {
    this.isRegistering = !this.isRegistering;
    this.messageError = "";
  }

  AutocompleteFields() {
    const baseEmail = "usuario";
    const domain = "@ejemplo.com";
    const randomNumber = Math.floor(Math.random() * 100);
    const emailToUse = `${baseEmail}${randomNumber}${domain}`;

    if (this.isRegistering) {
      this.newUserMail = emailToUse;
      this.newUserPass = "123456";
    } else {
      this.userMail = emailToUse;
      this.userPass = "123456";
    }
  }

  Register(){
    createUserWithEmailAndPassword(this.auth,this.newUserMail, this.newUserPass).then((res) =>{
      if(res.user.email !== null) {
        this.userLogged = res.user.email;
        this.router.navigate(['/home']);
      }
    }).catch((e) =>{
      this.flagError = true;
      switch(e.code){
        case "auth/invalid-email":
          this.messageError = "Email invalido";
          break;
        case "auth/email-already-in-use":
          this.messageError = "El email ya se encuentra en uso";
          break;
        case "auth/weak-password":
          this.messageError = "La contraseña +6 caracteres"
          break;
        default:
          this.messageError = e.code
          break;
      }
    })
  }

  Login() {
    signInWithEmailAndPassword(this.auth, this.userMail, this.userPass).then((res) => {
      if (res.user.email !== null) {
        this.userLogged = res.user.email;
        this.router.navigate(['/home']);
      }
    }).catch((e) => {
      this.flagError = true;
      switch(e.code){
        case "auth/invalid-email":
          this.messageError = "Email invalido";
          break;
        case "auth/invalid-credential":
          this.messageError = "Email o contraseña incorrectos";
          break;
        default:
          this.messageError = e.code
          break;
      }
    })
  }
}
