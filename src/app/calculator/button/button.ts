import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Number } from './number/number';
import { Operators } from './operators/operators';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-button',
  imports: [CommonModule, Number, Operators],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {

  @Output() numberClicked = new EventEmitter<string>();;
  @Output() operatorClicked = new EventEmitter<string>();

  onNumber(num: string) {
    this.numberClicked.emit(num);
  }

  onOperator(op: string) {
    this.operatorClicked.emit(op);
  }
}
