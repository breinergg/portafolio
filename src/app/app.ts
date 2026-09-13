import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Hero } from './hero/hero';
import { About } from './about/about';
import { PhotoMorph } from './shared/photo-morph';
import { Skills } from './skills/skills';

@Component({
  imports: [RouterOutlet, Header, Hero, About, Skills, PhotoMorph],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
