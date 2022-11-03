import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  constructor(private quizSVC: QuizService) {};

  ngOnInit() {
    const data = this.quizSVC.loadQuizzes();
    console.log(data);
  }
}
