import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userLogged: boolean = false;
  userEmail: string | null = null;

  constructor(private auth: Auth, private router: Router, private userService: UserService) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userLogged = true;
        this.userEmail = user.email;
      } else {
        this.userLogged = false;
        this.userEmail = null;
      }
    });
  }

  logOut() {
    this.auth.signOut().then(() => {
      this.userLogged = false;
      this.userService.clearUserEmail();
      this.router.navigate(['/log-in']);
    });
  }
}
