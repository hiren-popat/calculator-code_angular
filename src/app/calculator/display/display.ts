import { Component } from '@angular/core';
import { Result } from './result/result';
import { History } from './history/history';

@Component({
  selector: 'app-display',
  imports: [Result, History],
  templateUrl: './display.html',
  styleUrl: './display.css',
})
export class Display {

}
