import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  placeholders = [
    "What are we in the mood for today..",
    "Thinking, thinking..",
    "Play that funky music.."
  ]

  placeholder$ = new BehaviorSubject<string>(this.placeholders[Math.floor(Math.random() * this.placeholders.length)]);

  constructor() { }

  ngOnInit(): void {
    setInterval(() =>
      this.placeholder$.next(this.placeholders[Math.floor(Math.random() * this.placeholders.length)])
      , 10000);
  }
}
