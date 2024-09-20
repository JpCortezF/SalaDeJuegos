import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isChatVisible = false;

  ToggleChat() {
    this.isChatVisible = !this.isChatVisible;

    const chatIcon = document.getElementById('chatIcon')?.querySelector('img');
    
    if (this.isChatVisible) {
      if (chatIcon) {
        chatIcon.style.display = 'none';
      }
    } else {
      if (chatIcon) {
        chatIcon.style.display = 'block';
        chatIcon.style.width = '60px';
      }
    }
  }
}
