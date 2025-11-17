import { Component, effect, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  imports: [],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {

  
  bannerImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop",
  ];

  currentBannerIndex = signal(0);
  isPaused = signal(false);

  private touchStartX = 0;
  private touchEndX = 0;
  private interval: any;

  constructor() {
    effect(() => {
      if (!this.isPaused()) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    });
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.interval = setInterval(() => this.goToNextBanner(), 5000);
  }

  stopAutoSlide() {
    if (this.interval) clearInterval(this.interval);
  }

  goToNextBanner() {
    const next = (this.currentBannerIndex() + 1) % this.bannerImages.length;
    this.currentBannerIndex.set(next);
  }

  goToPreviousBanner() {
    const prev =
      (this.currentBannerIndex() - 1 + this.bannerImages.length) %
      this.bannerImages.length;
    this.currentBannerIndex.set(prev);
  }

  goToBanner(index: number) {
    this.currentBannerIndex.set(index);
  }

  pauseAutoSlide() {
    this.isPaused.set(true);
  }

  resumeAutoSlide() {
    this.isPaused.set(false);
  }

  // Touch Events
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) this.goToNextBanner();
      else this.goToPreviousBanner();
    }
  }
}
