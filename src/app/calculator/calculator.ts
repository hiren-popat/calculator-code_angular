import { Component, signal, HostListener } from '@angular/core';
import { Display } from './display/display';
import { Button } from './button/button';

@Component({
  selector: 'app-calculator',
  standalone: true, // Recommended for modern Angular
  imports: [Display, Button],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  // Start with '0' to avoid empty string math issues
  currentInputSignal = signal('0');
  previousInputSignal = signal('');
  operatorSignal = signal('');
  historySignal = signal('');
  lastOperatorSignal = signal('');
  lastOperandSignal = signal('');
  shouldResetInput = signal(false);
  isResultState = signal(false);



  formatNumber(value: number): string {
    if (value === 0) return '0';
    // Use exponential only for truly huge or tiny non-zero numbers
    if (Math.abs(value) >= 1e16 || Math.abs(value) < 1e-10) {
      return value.toExponential(10);
    }
    return Number(value.toPrecision(12)).toString();
  }

  handleNumber(num: string) {
    // If screen is '0' or we just hit '=', start a fresh number
    if (this.shouldResetInput() || this.currentInputSignal() === '0' || this.currentInputSignal() === 'Error') {
      this.currentInputSignal.set(num === '.' ? '0.' : num);
      this.shouldResetInput.set(false);
      this.isResultState.set(false);

      return;
    }

    const MAX_LENGTH = 16;
    if (this.currentInputSignal().replace('.', '').length >= MAX_LENGTH) return;

    if (num === '.' && this.currentInputSignal().includes('.')) return;

    this.currentInputSignal.update(val => val + num);
  }

  handleOperator(op: string) {
    if (op === 'C') return this.clear();
    if (this.currentInputSignal() === 'Error') return;
    if (op === '=') return this.calculate();
    if (op === '%') return this.handlePercent();


    if (op === 'D') {
      if (this.shouldResetInput()) {
        this.historySignal.set('');
        return;
      }
      this.currentInputSignal.update(val => (val.length <= 1 || val === 'Error' ? '0' : val.slice(0, -1)));
      return;
    }

    // Windows behavior: if you hit 1 + 2 + it calculates 3 immediately
    if (this.operatorSignal() && !this.shouldResetInput()) {
      this.calculate();
    }

    this.previousInputSignal.set(this.currentInputSignal());
    this.operatorSignal.set(op);
    this.shouldResetInput.set(true);
    this.isResultState.set(false);
    this.updateHistory();
  }

  calculate() {
    let prev = Number(this.previousInputSignal());
    let curr = Number(this.currentInputSignal());
    let op = this.operatorSignal();

    // Logic for repeating the last operation on multiple "=" clicks
    if (!op && this.lastOperatorSignal() && this.lastOperandSignal()) {
      prev = curr;
      curr = Number(this.lastOperandSignal());
      op = this.lastOperatorSignal();
    }

    if (!op || isNaN(prev) || isNaN(curr)) return;

    let result: number;
    switch (op) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/':
        if (curr === 0) return this.setError();
        result = prev / curr;
        break;
      default: return;
    }

    // Store for the next "=" or "%" press
    this.lastOperatorSignal.set(op);
    this.lastOperandSignal.set(curr.toString());

    this.historySignal.set(`${this.formatNumber(prev)} ${op} ${this.formatNumber(curr)} =`);
    this.currentInputSignal.set(this.formatNumber(result));

    this.previousInputSignal.set('');
    this.operatorSignal.set('');
    this.shouldResetInput.set(true);
    this.isResultState.set(true);
  }

  handlePercent() {
    const curr = Number(this.currentInputSignal());
    const op = this.operatorSignal();
    let result: number;

    // TIf we just hit equals and the last op was +/-
    if (this.isResultState() && (this.lastOperatorSignal() === '+' || this.lastOperatorSignal() === '-')) {
      result = (curr * curr) / 100;
    }
    // Standard percentage of previous value (e.g., 100 + 10%)
    else if (op === '+' || op === '-') {
      const prev = Number(this.previousInputSignal());
      result = (prev * curr) / 100;
    }
    // Default (e.g., 50 * 10% or just 5%)
    else {
      result = curr / 100;
    }

    this.currentInputSignal.set(this.formatNumber(result));
  }

  clear() {
    this.currentInputSignal.set('0');
    this.previousInputSignal.set('');
    this.operatorSignal.set('');
    this.historySignal.set('');
    this.lastOperatorSignal.set('');
    this.lastOperandSignal.set('');
    this.shouldResetInput.set(false);
    this.isResultState.set(false);
  }

  setError() {
    this.currentInputSignal.set('Error');
    this.previousInputSignal.set('');
    this.operatorSignal.set('');
    this.historySignal.set('');
    this.shouldResetInput.set(true);
  }

  updateHistory() {

    if (this.previousInputSignal() && this.operatorSignal()) {
      const displayPrev = this.formatNumber(Number(this.previousInputSignal()));
      this.historySignal.set(`${displayPrev} ${this.operatorSignal()}`);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    const key = event.key;
    if (/^\d$/.test(key) || key === '.') this.handleNumber(key);
    if (['+', '-', '*', '/'].includes(key)) this.handleOperator(key);
    if (key === 'Enter' || key === '=') this.handleOperator('=');
    if (key === 'Escape') this.handleOperator('C');
    if (key === '%') this.handleOperator('%');
    if (key === 'Backspace') this.handleOperator('D');
  }
}