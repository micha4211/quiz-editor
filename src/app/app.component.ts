import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';


interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
  newlyAdded: boolean;
  naiveCheckSum?: string;
}

interface QuestionDisplay {
  questionText: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  quizzesLoaded: boolean;

  constructor(private quizSVC: QuizService) {
    this.quizzesLoaded = false;
  };

  errorLoadingQuizzes = false;

  /*loadQuizzesFromWeb = () => {
    
    this.quizzes = [];
    this.quizzesLoaded = true;
  };*/

  loadQuizzesFromWeb = async () => {
    console.log(this.quizzesLoaded);
    try {
      const data = await this.quizSVC.loadQuizzes();

      this.quizzes = data.map((x: any) => ({
        quizName: x.name,
        quizQuestions: x.questions.map((y: any) => ({
          questionText: y.name
        })),
        markedForDelete: false,
        newlyAdded: false
      }));

      this.quizzes = this.quizzes.map(x => ({
        ...x,
        naiveCheckSum: this.generateNaiveCheckSum(x)
      }));
      
    }
    catch (err) {
      console.log(err);
    }
    this.quizzesLoaded = true;
    console.log(this.quizzesLoaded);
  };

  ngOnInit() {
    this.loadQuizzesFromWeb();
  }

  quizzes: QuizDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (quizToSelect: QuizDisplay) => {
    this.selectedQuiz = quizToSelect;
  };

  addQuiz = () => {

    const addedQuiz: QuizDisplay = {
      quizName: 'Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false,
      newlyAdded: true
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

  cancelAllChanges = () => {
    this.loadQuizzesFromWeb();
    this.selectedQuiz = undefined;
  }

  getDeletedQuizzes = () => this.quizzes.filter(x => x.markedForDelete);

  get deletedQuizCount() {
    return this.getDeletedQuizzes().length;
  };

  getAddedQuizzes = () => this.quizzes.filter(x => 
    x.newlyAdded 
    && !x.markedForDelete);

  get addedQuizzesCount() {
    return this.getAddedQuizzes().length;
  };

  generateNaiveCheckSum = (q: QuizDisplay) => {
    return q.quizName
      + "~"
      + q.quizQuestions.map(x => x.questionText).join("~");
  };

  getEditedQuiz = () => this.quizzes.filter(x => 
    !x.newlyAdded 
    && !x.markedForDelete
    && this.generateNaiveCheckSum(x) != x.naiveCheckSum
    );

  get editedQuizCount() {
    return this.getEditedQuiz().length;
  };






  jsPromisesOne = () => {
    const n1 = this.quizSVC.getMagicNumber(true);
    console.log(n1);

    n1
      .then( 
        n => {
          console.log(n);

          const n2 = this.quizSVC.getMagicNumber(true);

          n2

        }

      )
      .catch(
        e => {
          console.log(e);
        }
      );
  }

  jsPromisesTwo = async () => {
    try {
      const n1 = await this.quizSVC.getMagicNumber(true);
      console.log(n1);

      const n2 = await this.quizSVC.getMagicNumber(true);
      console.log(n2);
    }

    catch (err) {
      console.log(err);
    }
  }

  jsPromisesThree = async () => {
    try {
      const n1 =  this.quizSVC.getMagicNumber(false);
      console.log("Three N1:", n1);

      const n2 =  this.quizSVC.getMagicNumber(true);
      console.log("Three N2:", n2);

      const results = await Promise.any([n1,n2]);
      console.log("function 3:", results);

      const raceResults = await Promise.race([n1,n2]);
      console.log("function 3 race:", raceResults);
    }

    catch (err) {
      console.log("Function Three:", err);
    }
  }
}
