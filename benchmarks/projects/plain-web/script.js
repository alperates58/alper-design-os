document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('action-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      console.log('Action triggered successfully.');
    });
  }
});
