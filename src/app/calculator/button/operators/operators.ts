import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-operators',
  imports: [CommonModule],
  templateUrl: './operators.html',
  styleUrl: './operators.css',
})
export class Operators {
  @Input() displayOperators: string[] = [];
}
