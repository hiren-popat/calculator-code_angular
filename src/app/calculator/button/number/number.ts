import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number',
  imports: [CommonModule],
  templateUrl: './number.html',
  styleUrl: './number.css',
})
export class Number {

  @Input() displayNumbers: string[] = [];
}
















