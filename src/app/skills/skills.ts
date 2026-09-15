import { Component, computed, signal } from '@angular/core';
import { Reveal } from '../shared/reveal';

interface Skill {
  readonly name: string;
  readonly level: 'Básico' | 'Intermedio' | 'Intermedio avanzado' | 'Avanzado';
  readonly icon: string;
}

const SKILLS: readonly Skill[] = [
  { name: 'Angular', level: 'Intermedio', icon: '/images/skills/angular.svg' },
  { name: 'TypeScript', level: 'Intermedio', icon: '/images/skills/typescript.svg' },
  { name: 'JavaScript', level: 'Intermedio', icon: '/images/skills/javascript.svg' },
  { name: 'HTML5', level: 'Avanzado', icon: '/images/skills/html5.svg' },
  { name: 'CSS3', level: 'Intermedio', icon: '/images/skills/css.svg' },
  { name: 'Flutter', level: 'Intermedio', icon: '/images/skills/flutter.svg' },
  { name: 'Spring Boot', level: 'Intermedio', icon: '/images/skills/springboot.svg' },
  { name: 'Java', level: 'Intermedio', icon: '/images/skills/openjdk.svg' },
  { name: 'Git', level: 'Básico', icon: '/images/skills/git.svg' },
  { name: 'PostgreSQL', level: 'Básico', icon: '/images/skills/postgresql.svg' },
  { name: '.NET', level: 'Intermedio avanzado', icon: '/images/skills/dotnet.svg' },
];

@Component({
  selector: 'app-skills',
  imports: [Reveal],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  protected readonly skills = SKILLS;
  protected readonly activeIndex = signal(0);
  protected readonly activeSkill = computed(() => this.skills[this.activeIndex()]);

  protected select(index: number): void {
    this.activeIndex.set(index);
  }

  protected selectPrevious(): void {
    this.select((this.activeIndex() - 1 + this.skills.length) % this.skills.length);
  }

  protected selectNext(): void {
    this.select((this.activeIndex() + 1) % this.skills.length);
  }

  protected onWheel(event: WheelEvent): void {
    // Solo responde a desplazamiento horizontal; el scroll vertical sigue navegando la página.
    if (Math.abs(event.deltaX) < 8) {
      return;
    }

    event.preventDefault();
    if (event.deltaX > 0) {
      this.selectNext();
    } else {
      this.selectPrevious();
    }
  }

  protected onTrackKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.selectPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.selectNext();
    }
  }

  protected distanceFromActive(index: number): number {
    const difference = index - this.activeIndex();
    const wrapped = ((difference + this.skills.length / 2) % this.skills.length) - this.skills.length / 2;
    return Math.round(wrapped);
  }

  protected itemState(index: number): 'is-active' | 'is-neighbor' | 'is-distant' {
    const distance = Math.abs(this.distanceFromActive(index));

    if (distance === 0) {
      return 'is-active';
    }

    return distance === 1 ? 'is-neighbor' : 'is-distant';
  }
}
