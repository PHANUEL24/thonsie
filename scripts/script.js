// Select menu icon and navbar for mobile menu toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

// Select all sections and navigation links for scroll spy
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

// Highlight nav link based on scroll position (scroll spy)
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY; // Current scroll position
        let offset = sec.offsetTop - 150; // Section top minus offset
        let height = sec.offsetHeight; // Section height
        let id = sec.getAttribute('id'); // Section id

        // If current scroll is within this section
        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active'); // Remove active from all
                // Add active to the current section's nav link
                document.querySelector('header nav a[href*=' + id +']').classList.add('active');
            })
        }
    })
}

// Toggle mobile menu icon and navbar visibility
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x')
    navbar.classList.toggle('active')
}

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Update theme icon based on current mode
function updateThemeIcon() {
    if (body.classList.contains('light-mode')) {
        themeToggle.classList.remove('bx-moon');
        themeToggle.classList.add('bx-sun');
    } else {
        themeToggle.classList.remove('bx-sun');
        themeToggle.classList.add('bx-moon');
    }
}

// Load theme from localStorage on page load
let theme = localStorage.getItem('theme');
if (theme === 'light' || theme === null) {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
} else {
    body.classList.remove('light-mode');
}
updateThemeIcon();

// Toggle theme and save preference to localStorage
themeToggle.onclick = () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
}

// Contact form email sending for Formspree (AJAX, no redirect)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(contactForm); // Gather form data
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        // Show success message in a styled div
        const alertDiv = document.createElement('div');
        alertDiv.textContent = 'Message sent!';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.background = 'var(--main-color)';
        alertDiv.style.color = '#222';
        alertDiv.style.padding = '2rem 3rem';
        alertDiv.style.borderRadius = '1rem';
        alertDiv.style.fontSize = '2rem';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.boxShadow = '0 0 30px var(--main-color)';
        document.body.appendChild(alertDiv);
        setTimeout(() => {
          alertDiv.remove();
        }, 2000);
        contactForm.reset(); // Reset form fields
      } else {
        // Show error message from Formspree
        response.json().then(data => {
          alert(data.error || 'Oops! There was a problem submitting your form');
        });
      }
    }).catch(error => {
      // Show generic error message
      alert('Oops! There was a problem submitting your form');
    });
  });
}