import { Component, Input } from '@angular/core';
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
}
