import { Component, signal } from '@angular/core';
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
  currentInputSignal = signal('');
  previousInputSignal = signal('');
  operatorSignal = signal('');
  historySignal = signal('');

  handleNumber(num: string) {
    // Prevent multiple leading zeros like 0000
    if (this.currentInputSignal() === '0' && num === '0') return;

    // Replace 0 with first digit if currentInput is just '0'
    if (this.currentInputSignal() === '0') {
      this.currentInputSignal.set(num);
    } else {
      this.currentInputSignal.update(val => val + num);
    }
  }

  handleOperator(op: string) {
    if (op === 'C') {
      this.clear();
      return;
    }

    if (op === '=') {
      this.calculate();
      return;
    }

    // If there's already an operator and a current input, calculate first
    if (this.operatorSignal() && this.currentInputSignal()) {
      this.calculate();
    }

    // Move current input to previous input
    if (this.currentInputSignal()) {
      this.previousInputSignal.set(this.currentInputSignal());
      this.currentInputSignal.set('');
    }

    this.operatorSignal.set(op);
    this.updateHistory();
  }

  calculate() {
    const prev = parseFloat(this.previousInputSignal());
    const curr = parseFloat(this.currentInputSignal());
    const op = this.operatorSignal();

    if (isNaN(prev) || isNaN(curr) || !op) return;

    let result: number;
    switch (op) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/':
        if (curr === 0) {
          alert('Cannot divide by zero');
          this.clear();
          return;
        }
        result = prev / curr;
        break;
      default: return;
    }

    this.historySignal.set(`${prev} ${op} ${curr} =`);
    this.currentInputSignal.set(result.toString());
    this.previousInputSignal.set('');
    this.operatorSignal.set('');
  }

  clear() {
    this.currentInputSignal.set('');
    this.previousInputSignal.set('');
    this.operatorSignal.set('');
    this.historySignal.set('');
  }

  updateHistory() {
    if (this.previousInputSignal() && this.operatorSignal()) {
      this.historySignal.set(`${this.previousInputSignal()} ${this.operatorSignal()}`);
    }
  }
}