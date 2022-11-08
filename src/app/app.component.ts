import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
}

interface QuestionDisplay {
  questionText: string;
}

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

    this.quizzes = data.map((x: any) => ({
      quizName: x.name,
      quizQuestions: x.questions.map((y: any) => ({
        questionText: y.name
      }))
    }));
    console.log(data);
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (quizToSelect: QuizDisplay) => {
    this.selectedQuiz = quizToSelect;
  };

  addQuiz = () => {

    const addedQuiz: QuizDisplay = {
      quizName: 'Untitled Quiz',
      quizQuestions: []
    };

    this.quizzes = [
      ...this.quizzes,
      addedQuiz
    ];

    this.selectQuiz(addedQuiz);
  };

  addQuestion = () => {
    if (this.selectedQuiz != undefined) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions,
        {questionText: "New Question"}
      ]
    }
  };

  removeQuestion = (questionToRemove: QuestionDisplay) => {
    if (this.selectedQuiz != undefined) {
      this.selectedQuiz.quizQuestions = this.selectedQuiz.quizQuestions.filter(x => x !== questionToRemove)
    }
  };
}
