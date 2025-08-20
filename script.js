// Initialize Lucide icons
  lucide.createIcons();

  // Toggle sidebar functionality
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');

  menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      mainContent.classList.toggle('full-width');
      
      // Update the menu icon based on sidebar state
      const menuIcon = menuToggle.querySelector('i');
      if (sidebar.classList.contains('hidden')) {
          menuIcon.setAttribute('data-lucide', 'menu');
      } else {
          menuIcon.setAttribute('data-lucide', 'x');
      }
      lucide.createIcons();
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  themeToggle.addEventListener('click', () => {
      htmlElement.classList.toggle('dark');
      
      // Update the theme icon based on current theme
      const themeIcon = themeToggle.querySelectorAll('.theme-icon');
      if (htmlElement.classList.contains('dark')) {
          themeIcon[0].style.display = 'none';
          themeIcon[1].style.display = 'block';
      } else {
          themeIcon[0].style.display = 'block';
          themeIcon[1].style.display = 'none';
      }
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target) &&
          !sidebar.classList.contains('hidden')) {
          sidebar.classList.add('hidden');
          mainContent.classList.add('full-width');
          
          // Update the menu icon
          const menuIcon = menuToggle.querySelector('i');
          menuIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
      }
  });

  // Back button functionality
  const backButton = document.getElementById("back-button");
  if (backButton) {
      backButton.addEventListener("click", () => {
          window.history.back();
      });
  }

  document.getElementById('back-button').addEventListener('click', function () {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('hidden');
  });

  // Get all navigation items
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');

  // Add click event listener to each navigation item
  navItems.forEach(item => {
      item.addEventListener('click', () => {
          // Remove 'active' class from all items
          navItems.forEach(nav => nav.classList.remove('active'));

          // Add 'active' class to the clicked item
          item.classList.add('active');
      });
  });

  // Highlight the active link based on the current page URL
  const currentPath = window.location.pathname;
  navItems.forEach(item => {
      if (item.getAttribute('href') === currentPath) {
          item.classList.add('active');
      }
  });