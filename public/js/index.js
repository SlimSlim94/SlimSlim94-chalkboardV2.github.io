function login() {
  // Request for the signup
  const XHR = new XMLHttpRequest();
  // Form data to send
  const FD = new FormData(document.getElementById('loginForm'));

  const messageLabel = document.getElementById('messageLabel');
  messageLabel.innerHTML = '';

  // Listener when request is completed
  XHR.addEventListener('load', (event) => {
    // If not HTTP Created, then displaying status in the message
    if (event.target.status !== 200) {
      messageLabel.innerHTML = getErrorMessage(event.target);
    } else {
      // Saving user information
      sessionStorage.setItem('currentUser', event.target.response);
      // Redirecting the user to the corresponding dashboard
      const user = JSON.parse(event.target.response);
      switch (user.role) {
        case 'admin':
          window.location.href = 'admin_dashboard.html';
          break;
        case 'student':
          window.location.href = 'student_dashboard.html';
          break;
        case 'teacher':
          window.location.href = 'professor_dashboard.html';
          break;
        default:
          break;
      }
    }
  });

  // Listener when request has failed
  XHR.addEventListener('error', () => {
    messageLabel.innerHTML = 'Network error';
  });

  XHR.open('POST', 'http://localhost/api/login');
  XHR.send(FD);
}
