window.onload = function () {
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const closeLogin = document.getElementById('closeLogin');
  const closeRegister = document.getElementById('closeRegister');

  loginBtn.onclick = () => loginModal.style.display = 'block';
  registerBtn.onclick = () => registerModal.style.display = 'block';

  closeLogin.onclick = () => loginModal.style.display = 'none';
  closeRegister.onclick = () => registerModal.style.display = 'none';

  cancelBtn.onclick = () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  };

  window.onclick = function (e) {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
  };
};
