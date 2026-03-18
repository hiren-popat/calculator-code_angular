import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-operators',
  imports: [CommonModule],
  templateUrl: './operators.html',
  styleUrl: './operators.css',
})
export class Operators {
  @Input() displayOperators: string[] = [];

  @Output() operatorClicked = new EventEmitter<string>()

  onOperatorClick(op: string) {
    this.operatorClicked.emit(op);
  };
}
