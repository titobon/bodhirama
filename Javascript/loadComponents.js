// Carga la Navbar y el Footer, y maneja la lógica de navegación
document.addEventListener('DOMContentLoaded', function() {
  // Carga la Navbar
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
      attachNavbarEvents();
      highlightActiveLink();
      
      // Setup the language switcher since it's now in the DOM
      if (typeof setupLangSwitcher === 'function') {
        setupLangSwitcher();
      }
      
      // Translate newly loaded content
      if (typeof translatePage === 'function' && typeof getCurrentLanguage === 'function') {
        translatePage(getCurrentLanguage());
      }
    });

  // Carga el Footer
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
      // Translate newly loaded content
      if (typeof translatePage === 'function' && typeof getCurrentLanguage === 'function') {
        translatePage(getCurrentLanguage());
      }
    });
});

function attachNavbarEvents() {
  var hamburger = document.querySelector('.hamburger');
  var navBar = document.querySelector('.nav_bar'); // Target the main navbar container
  if (hamburger && navBar) {
    hamburger.addEventListener('click', function() {
      navBar.classList.toggle('active'); // Toggle active class on the .nav_bar container
    });
  }
}

function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop(); // Get current page filename
  const navLinks = document.querySelectorAll('.nav_bar ul li a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active'); // Add 'active' class to the current page's link
    }
  });
}