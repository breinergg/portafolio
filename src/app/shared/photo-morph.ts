import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';

/**
 * Transición tipo "flip-card" ligada al scroll entre la foto del hero y la del about.
 *
 * Una única tarjeta fija interpola posición, tamaño y rotación (rotateY 0→180°)
 * entre las dos figuras ancladas (`[data-flip-anchor]`): la cara frontal es la
 * foto del hero y la trasera la del about, entrelazadas en un solo giro.
 *
 * Mejora progresiva: sin JS o con `prefers-reduced-motion`, cada sección muestra
 * su propia foto estática y esta capa permanece oculta.
 */
@Component({
  selector: 'app-photo-morph',
  templateUrl: './photo-morph.html',
  styleUrl: './photo-morph.css',
})
export class PhotoMorph implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cardRef = viewChild.required<ElementRef<HTMLElement>>('card');

  private hero: HTMLElement | null = null;
  private about: HTMLElement | null = null;
  private frame = 0;
  private readonly onScroll = (): void => this.schedule();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.hero = document.querySelector<HTMLElement>('[data-flip-anchor="hero"]');
    this.about = document.querySelector<HTMLElement>('[data-flip-anchor="about"]');
    if (!this.hero || !this.about) {
      return;
    }

    // Las fotos ancladas ceden su lugar al overlay (mantienen su caja para el layout).
    this.hideAnchorImage(this.hero);
    this.hideAnchorImage(this.about);
    this.cardRef().nativeElement.classList.add('is-active');

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      this.update();
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }

  private hideAnchorImage(anchor: HTMLElement): void {
    const image = anchor.querySelector('img');
    if (image) {
      image.style.visibility = 'hidden';
    }
  }

  private schedule(): void {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  }

  private update(): void {
    if (!this.hero || !this.about) {
      return;
    }

    const heroRect = this.hero.getBoundingClientRect();
    const aboutRect = this.about.getBoundingClientRect();
    const viewport = window.innerHeight;
    const scrollY = window.scrollY;

    // La transición ocurre mientras la foto viaja de un centro de viewport al otro.
    const heroCenter = scrollY + heroRect.top + heroRect.height / 2;
    const aboutCenter = scrollY + aboutRect.top + aboutRect.height / 2;
    const start = heroCenter - viewport / 2;
    const span = Math.max(1, aboutCenter - viewport / 2 - start);
    const progress = clamp((scrollY - start) / span, 0, 1);

    const left = lerp(heroRect.left, aboutRect.left, progress);
    const top = lerp(heroRect.top, aboutRect.top, progress);
    const width = lerp(heroRect.width, aboutRect.width, progress);
    const height = lerp(heroRect.height, aboutRect.height, progress);

    const card = this.cardRef().nativeElement;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.width = `${width}px`;
    card.style.height = `${height}px`;
    card.style.transform = `perspective(1600px) rotateY(${(progress * 180).toFixed(2)}deg)`;
    card.style.opacity = '1';
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}
