import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(url);
  }

  getAll() {
    return [
      { id: './../json/quiz-questionare/javascript.json', name: 'JavaScript' },
      { id: './../json/quiz-questionare/aspnet.json', name: 'Asp.Net' },
      { id: './../json/quiz-questionare/csharp.json', name: 'C Sharp' },
      { id: './../json/quiz-questionare/designPatterns.json', name: 'Design Patterns' }
    ];
  }
}
