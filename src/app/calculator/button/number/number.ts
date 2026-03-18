import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-number',
  imports: [CommonModule],
  templateUrl: './number.html',
  styleUrl: './number.css',
})
export class Number {

  @Input() displayNumbers: string[] = [];
  @Output() numberClicked = new EventEmitter<string>();

  onNumberClick(num: string) {
    this.numberClicked.emit(num);
  }
}
















