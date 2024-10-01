import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizContestService {

  private apiUrl = 'https://api.quiz-contest.xyz/questions';
  private apiKey = '$2b$12$uuoFn51wZ.Ft2vf.Tl8Ite.ISIqjL23d72ev1eNdIwEIN6prCxDG.';
  

  constructor(private http: HttpClient) { }

  getQuestions(limit: number, page: number, category: string ,format: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.apiKey);

    const url = `${this.apiUrl}?limit=${limit}&page=${page}&category=${category}&format=${format}`;

    return this.http.get(url, { headers });
  }
}
