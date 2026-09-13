import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';

/**
 * Añade la clase `is-visible` cuando el elemento entra en el viewport.
 * Reutilizable para animaciones de entrada en cualquier sección.
 * Respeta `prefers-reduced-motion` y entornos sin navegador (SSR/prerender).
 */
@Directive({
  selector: '[appReveal]',
})
export class Reveal implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  /** Proporción visible del elemento para disparar la animación. */
  readonly threshold = input(0.25);

  ngOnInit(): void {
    const element = this.host.nativeElement;

    const canObserve =
      isPlatformBrowser(this.platformId) &&
      'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canObserve) {
      element.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: this.threshold() },
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
