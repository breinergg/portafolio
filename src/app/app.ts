import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Hero } from './hero/hero';

@Component({
  imports: [RouterOutlet, Hero],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
