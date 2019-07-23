(function() {
  let newPasswordValue;
  let confirmationValue;
  const form = document.querySelector('form');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  const validationMessage = document.getElementById('validation-message');

  function validatePasswords(message, add, remove) {
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
  }

  confirmPassword.addEventListener('input', e => {
    e.preventDefault();
    newPasswordValue = newPassword.value;
    confirmationValue = confirmPassword.value;

    if (newPasswordValue !== confirmationValue) {
      validatePasswords('Passwords do not match', 'color-red', 'color-green');
    } else {
      validatePasswords('Passwords match', 'color-green', 'color-red');
    }
  });

  form.addEventListener('submit', e => {
    if (newPasswordValue !== confirmationValue) {
      e.preventDefault();
      const error = document.getElementById('error');
      if (!error) {
        const flashErrorH1 = document.createElement('h1');
        flashErrorH1.classList.add('color-red');
        flashErrorH1.setAttribute('id', 'error');
        flashErrorH1.textContent = 'Passwords do not match';
        const navbar = document.getElementById('navbar');
        navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
      }
    }
  });
})();
