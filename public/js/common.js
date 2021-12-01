// Processes the received target to get the error message
function getErrorMessage(target) {
  let result = '';
  if (target.response) {
    const response = JSON.parse(target.response);
    result = response.message;
  } else result = `Status ${target.status}. ${target.statusText}`;

  return result;
}

// Logouts the user
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}
