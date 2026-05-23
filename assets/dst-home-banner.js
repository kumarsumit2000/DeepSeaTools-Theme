/**
 * <dst-banner-carousel>
 *
 * Lightweight, scroll-snap based slider for the Home Banner section.
 * - Uses native CSS scroll-snap for slide-to-slide behavior (zero-JS fallback).
 * - JS adds: dot navigation, dot syncing on scroll, optional auto-rotate.
 * - Auto-rotate pauses on hover, focus-within, and document hidden.
 */
class DstBannerCarousel extends HTMLElement {
  constructor() {
    super();
    this.slidesEl = this.querySelector('.dst-hb__slides');
    this.dots = Array.from(this.querySelectorAll('.dst-hb__dot'));
    this.autoSeconds = parseInt(this.dataset.autoSeconds || '0', 10);
    this.autoTimer = null;
    this.paused = false;
    this.currentIndex = 0;
  }

  connectedCallback() {
    if (!this.slidesEl) return;

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });

    this.slidesEl.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    if (this.autoSeconds > 0) {
      this.addEventListener('mouseenter', () => this.pause());
      this.addEventListener('mouseleave', () => this.resume());
      this.addEventListener('focusin', () => this.pause());
      this.addEventListener('focusout', () => this.resume());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.pause();
        else this.resume();
      });
      this.start();
    }
  }

  disconnectedCallback() {
    if (this.autoTimer) clearInterval(this.autoTimer);
  }

  goTo(index) {
    if (!this.slidesEl) return;
    const slides = this.slidesEl.children;
    if (index < 0 || index >= slides.length) return;
    const target = slides[index];
    this.slidesEl.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }

  handleScroll() {
    if (this._scrollRaf) return;
    this._scrollRaf = requestAnimationFrame(() => {
      this._scrollRaf = null;
      const scrollLeft = this.slidesEl.scrollLeft;
      const slideWidth = this.slidesEl.clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== this.currentIndex) {
        this.currentIndex = newIndex;
        this.syncDots();
      }
    });
  }

  syncDots() {
    this.dots.forEach((dot, i) => {
      const active = i === this.currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  start() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      if (this.paused) return;
      const total = this.slidesEl.children.length;
      const next = (this.currentIndex + 1) % total;
      this.goTo(next);
    }, this.autoSeconds * 1000);
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}

if (!customElements.get('dst-banner-carousel')) {
  customElements.define('dst-banner-carousel', DstBannerCarousel);
}
