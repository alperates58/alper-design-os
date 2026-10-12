// Legacy Plain Web Client Logic
document.getElementById('dispatch-form').addEventListener('submit', function (e) {
  var routeInput = document.querySelector('input[name="routeCode"]');
  var authInput = document.querySelector('input[name="authCode"]');

  if (!routeInput.value || !authInput.value) {
    alert('Please fill all mandatory fields!');
    e.preventDefault();
    return false;
  }
  
  // Submit continues to server action
});
