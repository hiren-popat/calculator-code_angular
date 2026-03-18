import { Component } from '@angular/core';
import { Number } from './button/number/number';
import { Display } from './display/display';
import { Button } from './button/button';

@Component({
  selector: 'app-calculator',
  imports: [Display, Button],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {

}
