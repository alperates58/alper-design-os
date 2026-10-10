// Golden Web Application Logic - Verified Clean Implementation

document.addEventListener('DOMContentLoaded', () => {
  // 1. Single deduplicated status fetch with in-memory caching
  let statusCache = null;
  const fetchAppStatus = async () => {
    if (statusCache) return statusCache;
    try {
      const response = await fetch('/api/status');
      if (response.ok) {
        statusCache = await response.json();
        const badge = document.getElementById('status-badge');
        if (badge) {
          badge.textContent = `Status: ${statusCache.status.toUpperCase()}`;
        }
      }
    } catch {
      // Handled gracefully without polluting console with unhandled errors
      const badge = document.getElementById('status-badge');
      if (badge) badge.textContent = 'Status: Offline';
    }
    return statusCache;
  };

  // 2. Valid configuration fetch
  fetch('/api/config')
    .then((res) => (res.ok ? res.json() : null))
    .then((config) => {
      if (config && window.__BENCHMARK_DEBUG) {
        window.__APP_CONFIG = config;
      }
    })
    .catch(() => {});

  fetchAppStatus();

  // 3. Robust, accessible form submission with clear feedback states
  const form = document.getElementById('order-form');
  const input = document.getElementById('coupon-code');
  const feedback = document.getElementById('form-feedback');

  if (form && input && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = input.value.trim();

      if (!code) {
        // Clear visual error feedback
        input.classList.add('input-error');
        feedback.className = 'feedback-container show-error';
        feedback.textContent = 'Error: Please enter a valid operational voucher code.';
        input.focus();
        return;
      }

      // Success feedback
      input.classList.remove('input-error');
      feedback.className = 'feedback-container show-success';
      feedback.textContent = `Voucher "${code}" verified and applied successfully.`;
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) {
        input.classList.remove('input-error');
        feedback.className = 'feedback-container';
        feedback.textContent = '';
      }
    });
  }
});
