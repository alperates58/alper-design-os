// Broken Web Application Logic

// SEED-07: Fake hardcoded test secret pattern (safe, synthetic test key)
const FAKE_TEST_STRIPE_KEY = "sk_test_fake_000000000000000000000000";

document.addEventListener('DOMContentLoaded', () => {
  // SEED-01: JavaScript console error triggered on load
  console.error("TelemetryError: Uncaught ReferenceError: nonExistentAnalyticsTracker is not defined");

  // SEED-02: Failed network request (404)
  fetch('/api/missing-telemetry-endpoint')
    .then((res) => {
      if (!res.ok) {
        console.warn(`[Network Warning] Endpoint /api/missing-telemetry-endpoint returned HTTP ${res.status}`);
      }
    })
    .catch((err) => {
      console.error('[Network Error] Failed fetching telemetry:', err);
    });

  // SEED-06: Duplicate network requests fired simultaneously
  fetch('/api/status')
    .then((r) => r.json())
    .then((data) => {
      const badge = document.getElementById('status-badge');
      if (badge) badge.textContent = `Status: ${data.status}`;
    });

  // Second duplicate request without cache check
  fetch('/api/status')
    .then((r) => r.json())
    .then((data) => {
      // Duplicate fetch handling
      window.__redundantStatus = data;
    });

  // SEED-09: Form submit with invalid/empty input fails silently with no error message
  const form = document.getElementById('order-form');
  const input = document.getElementById('coupon-code');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (input && input.value) ? input.value.trim() : '';
      if (!val) {
        // Bad UI State: Silent failure, leaves user hanging with no error indicator
        if (feedback) {
          feedback.style.display = 'none';
          feedback.textContent = '';
        }
        return;
      }
      if (feedback) {
        feedback.style.display = 'block';
        feedback.textContent = `Voucher applied: ${val}`;
      }
    });
  }
});
