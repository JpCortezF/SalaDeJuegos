import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sala_juegos';
  userLogged: boolean = false;

  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userLogged = true;
      } else {
        this.userLogged = false;
      }
    });
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.userLogged = false;
      this.router.navigate(['/log-in']);
    });
  }
}
