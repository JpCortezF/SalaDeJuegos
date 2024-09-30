import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { addDoc, collection, collectionData, Firestore, where, orderBy, limit, query, doc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  lastDate: string | null = null;
  isChatVisible = false;
  messages: any[] = [];
  newMessage = '';
  
  textareaHeight = 'auto';
  private readonly maxRows = 4;
  
  public userEmail: string | null = "";
  private sub!: Subscription;

  constructor(private firestore: Firestore, private userService: UserService, public auth: Auth) {
    //this.userEmail = this.userService.getUserEmail();
  }

  AdjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, this.maxRows * 30);
    this.textareaHeight = `${newHeight}px`;
  }

  ngOnInit() {
    //this.userEmail = this.userService.getUserEmail();
    this.auth.onAuthStateChanged((auth)=>{
      if(auth?.email){
        this.GetData();
        this.userEmail = auth?.email;
      }else{
        this.userEmail = null;
      }
    })    
  }

  ToggleChat() {
    this.isChatVisible = !this.isChatVisible;
    const chatIcon = document.getElementById('chatIcon')?.querySelector('img');
    if (chatIcon) {
      chatIcon.style.display = this.isChatVisible ? 'none' : 'block';
    }
  }

  SendMessage() {
    if(this.userEmail !== null){
      if (this.newMessage.trim() !== '') {
        const message = { 
          text: this.newMessage.trim(), 
          user: this.userEmail, 
          fecha: new Date()
        };
        
        const col = collection(this.firestore, 'chats');
        addDoc(col, message).then(() => {
          this.newMessage = '';
          this.ScrollToBottom();
        });
        this.textareaHeight = 'auto';
      }
    }
  }

  GetData(){
    const col = collection(this.firestore, 'chats');
    const q = query(col, orderBy('fecha'));

    const observable = collectionData(q);
    this.sub = observable.subscribe((messages: any) => {
      this.lastDate = null;
      this.messages = messages;
      this.ScrollToBottom();
    });
  }

  ScrollToBottom() {
    const chatElement = document.querySelector('.chat');
    if(chatElement !== null){
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

  GetUserName(email: string): string {
    return email.split('@')[0];
  }

  FormatTime(date: any): string {
    if (date && date.toDate) {
      const d = date.toDate();
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }

  FormatDate(date: any): string {
    if (date && date.toDate) {
      const d = date.toDate();
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
  }

  IsNewDay(index: number): boolean {
    if (index === 0) {
      // Siempre mostrar la fecha en el primer mensaje
      this.lastDate = this.FormatDate(this.messages[index].fecha);
      return true;
    }
    
    const currentMessageDate = this.FormatDate(this.messages[index].fecha);
    const previousMessageDate = this.FormatDate(this.messages[index - 1].fecha);
    
    if (currentMessageDate !== previousMessageDate) {
      this.lastDate = currentMessageDate;
      return true;
    }
    
    return false;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
