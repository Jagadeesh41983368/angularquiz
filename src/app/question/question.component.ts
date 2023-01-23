import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name : string = "" ;
  public questionList : any = [];
  public currentQuestion : number = 0;
  public points : number = 0;
  counter = 60; 
  correctAnswer : number = 0;
  wrongAnswer : number = 0;
  interval$ : any;
  progress : string = "0";
  isQuizComplete : boolean  = false;
  constructor(private question : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions(){
    this.question.getQuestionJson().subscribe(res=>{
      console.log(res.questions);
      this.questionList = res.questions;
      
    })
  }

  nextQuestion(){
    this.currentQuestion++;
    this.resetCounter();
    console.log(this.currentQuestion);
    

  }

  previousQuestion(){
    this.currentQuestion--;
    this.resetCounter();

  }

  answer(currentQuestion:number,option:any){

    if (currentQuestion===this.questionList.length){
      this.isQuizComplete = true;
      this.stopCounter()
    }
    if(option.correct){
      this.points+=10;
      this.correctAnswer++;

      setTimeout(()=>{
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercentage();

      },1000)
      
    }
    else{
    this.points-=10;  
    
    
    setTimeout(()=>{
      this.currentQuestion++;
      this.wrongAnswer++;
      this.resetCounter();
      this.getProgressPercentage();


    },1000)
    }
  }

  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val=>{
      this.counter--;
      if (this.counter===0){
        this.currentQuestion++;
        this.counter = 60;
        this.points-=10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();
    },600000)
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 0;

  }

  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = '0';

  }

  getProgressPercentage(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}


