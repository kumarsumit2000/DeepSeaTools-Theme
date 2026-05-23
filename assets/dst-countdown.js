/**
 * <dst-countdown end="2025-12-31T23:59:59" [show-days]>
 *
 * Lightweight countdown timer that updates four <span> slots in its slot tree.
 * Markup pattern expected:
 *   <dst-countdown end="...">
 *     <span data-cd-days>00</span>
 *     <span data-cd-hours>00</span>
 *     <span data-cd-mins>00</span>
 *     <span data-cd-secs>00</span>
 *   </dst-countdown>
 *
 * When the timer reaches zero, dispatches a 'dst:countdown-ended' event.
 */
class DstCountdown extends HTMLElement {
  constructor() {
    super();
    this.endTime = null;
    this.timerId = null;
    this.daysEl = this.querySelector('[data-cd-days]');
    this.hoursEl = this.querySelector('[data-cd-hours]');
    this.minsEl = this.querySelector('[data-cd-mins]');
    this.secsEl = this.querySelector('[data-cd-secs]');
  }

  connectedCallback() {
    const endStr = this.getAttribute('end');
    if (!endStr) return;
    const parsed = new Date(endStr).getTime();
    if (Number.isNaN(parsed)) return;
    this.endTime = parsed;
    this.tick();
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    if (this.timerId) clearInterval(this.timerId);
  }

  tick() {
    const now = Date.now();
    const diff = Math.max(0, this.endTime - now);
    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
    if (this.minsEl) this.minsEl.textContent = String(mins).padStart(2, '0');
    if (this.secsEl) this.secsEl.textContent = String(secs).padStart(2, '0');

    if (diff === 0 && this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      this.classList.add('is-ended');
      this.dispatchEvent(new CustomEvent('dst:countdown-ended', { bubbles: true }));
    }
  }
}

if (!customElements.get('dst-countdown')) {
  customElements.define('dst-countdown', DstCountdown);
}
