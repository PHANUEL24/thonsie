document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Dummy login: always succeed
    window.location.href = 'welcome.html';
});
