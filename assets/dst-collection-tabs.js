/**
 * <dst-collection-tabs>
 *
 * Accessible tab pattern (APG style):
 *   - Click activates a tab.
 *   - Left/Right arrow keys move focus between tabs and activate.
 *   - Home/End keys jump to first/last tab.
 *   - Inactive panels are [hidden].
 */
class DstCollectionTabs extends HTMLElement {
  constructor() {
    super();
    this.tabs = Array.from(this.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.querySelectorAll('[role="tabpanel"]'));
  }

  connectedCallback() {
    if (!this.tabs.length) return;

    this.tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => this.activate(idx));
      tab.addEventListener('keydown', (e) => this.handleKey(e, idx));
    });
  }

  activate(index) {
    if (index < 0 || index >= this.tabs.length) return;

    this.tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    this.panels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('is-active', active);
      if (active) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });

    this.tabs[index].focus();
  }

  handleKey(event, idx) {
    let next = null;
    switch (event.key) {
      case 'ArrowRight':
        next = (idx + 1) % this.tabs.length;
        break;
      case 'ArrowLeft':
        next = (idx - 1 + this.tabs.length) % this.tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.activate(next);
  }
}

if (!customElements.get('dst-collection-tabs')) {
  customElements.define('dst-collection-tabs', DstCollectionTabs);
}
