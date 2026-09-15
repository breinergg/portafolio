import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly containerRef = viewChild.required<ElementRef<HTMLElement>>('container');
  private readonly titleRef = viewChild.required<ElementRef<HTMLElement>>('title');
  private readonly portraitRef = viewChild.required<ElementRef<HTMLElement>>('portrait');

  private resizeObserver?: ResizeObserver;
  private frame = 0;
  private settleFrame = 0;
  private readonly onResize = (): void => this.schedulePortraitPosition();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.titleRef().nativeElement);
    window.addEventListener('resize', this.onResize, { passive: true });
    this.schedulePortraitPosition();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    if (this.settleFrame) {
      cancelAnimationFrame(this.settleFrame);
    }
  }

  private schedulePortraitPosition(): void {
    if (this.frame) {
      return;
    }

    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.updatePortraitPosition();
      // El navegador aplica el top absoluto en el frame siguiente.
      this.settleFrame = requestAnimationFrame(() => {
        this.settleFrame = 0;
        this.updatePortraitPosition();
      });
    });
  }

  private updatePortraitPosition(): void {
    const container = this.containerRef().nativeElement;

    if (!window.matchMedia('(max-width: 768px)').matches) {
      container.style.removeProperty('--hero-portrait-mobile-top');
      return;
    }

    const title = this.titleRef().nativeElement;
    const portrait = this.portraitRef().nativeElement;
    const containerRect = container.getBoundingClientRect();
    const desiredTop = title.getBoundingClientRect().bottom - containerRect.top + 4;
    const currentTop = portrait.getBoundingClientRect().top - containerRect.top;
    const declaredTop = Number.parseFloat(getComputedStyle(portrait).top);

    container.style.setProperty(
      '--hero-portrait-mobile-top',
      `${declaredTop + desiredTop - currentTop}px`,
    );
  }
}
