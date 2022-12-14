import { Component, OnInit } from '@angular/core';
import { QuizService, ShapeForSavingEditedQuizzes, ShapeForSavingNewQuizzes } from './quiz.service';
import { trigger, style, animate, transition, keyframes} from '@angular/animations';

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
  animations: [
    trigger('detailsFromLeft', [
      transition('leftPosition => finalPosition', [
        animate('300ms', keyframes([
          style({ marginLeft: '-30px', offset: 0.0 }),
          style({ marginLeft: '-20px', offset: 0.25 }),
          style({ marginLeft: '-10px', offset: 0.5 }),
          style({ marginLeft: '-5px', offset: 0.75 }),
          style({ marginLeft: '0px', offset: 1.0 })
        ]))
      ]),
    ]),
    trigger('pulseSaveCancelButtons', [
      transition('nothingToSave => somethingToSave', [
        animate('400ms', keyframes([
          style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 0.0 }),
          style({ transform: 'scale(1.3)', 'transform-origin': 'top left', offset: 0.5 }),
          style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'quiz-editor';

  quizzesLoaded: boolean;

  constructor(private quizSVC: QuizService) {
    this.quizzesLoaded = false;
  };

  errorLoadingQuizzes = false;

  loadQuizzesFromWeb = async () => {
    
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
    this.detailsFromLeftAnimationState = "finalPosition";
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
    this.isQuizEdited(x)
    );

  get editedQuizCount() {
    return this.getEditedQuiz().length;
  };

  isQuizEdited = (x: QuizDisplay) =>
    !x.newlyAdded 
    && !x.markedForDelete
    && this.generateNaiveCheckSum(x) != x.naiveCheckSum;

  saveQuizzes = async() => {
    try {
      const newQuizzes: ShapeForSavingNewQuizzes[] = this.getAddedQuizzes().map(x => ({
        quizName: x.quizName,
        quizQuestions: x.quizQuestions.map(y => y.questionText)
      }))
      
      const editedQuizzes: ShapeForSavingEditedQuizzes[] = this.getEditedQuiz().map(x => ({
        quiz: x.quizName,
        questions: x.quizQuestions.map(y => ({
          question: y.questionText
        }))

      }));
      const numberOfEditedQuizzesSaved = await this.quizSVC.saveQuizzes(
        editedQuizzes,
        newQuizzes
      )
      console.log("edited quizzes save", numberOfEditedQuizzesSaved);
    }
    catch (e) {
      console.error(e);
    }
  }

  detailsFromLeftAnimationState = "leftPosition";

  detailsFromLeftAnimationDone = () => {
    this.detailsFromLeftAnimationState = "leftPosition";

  }







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
