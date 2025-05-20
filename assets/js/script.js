document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    const isActive = navLinksContainer.classList.toggle('active');
    
    if (isActive) {
      navToggle.innerHTML = '✕'; // Change to 'X' (close) icon
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      navToggle.innerHTML = '☰'; // Change back to hamburger icon
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Optional: Close menu if a link is clicked (good for single-page apps or UX)
  // If your links navigate to different pages, this might not be strictly necessary
  // but doesn't hurt.
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        navToggle.innerHTML = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active link highlighting based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is '/'
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Determine current page to render projects accordingly
  const path = window.location.pathname;

  if (document.getElementById('featured-projects-grid')) {
    renderProjects('#featured-projects-grid', true); // Render only featured projects on index.html
  }
  
  if (document.getElementById('all-projects-grid')) {
    renderProjects('#all-projects-grid', false); // Render all projects on projects.html
  }
});

// Function to create HTML for a single project card
function createProjectCard(project) {
  return `
    <div class="project-card">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-links">
        ${project.liveDemoUrl ? `<a href="${project.liveDemoUrl}" target="_blank">Live Demo</a>` : ''}
        ${project.githubRepoUrl ? `<a href="${project.githubRepoUrl}" target="_blank">GitHub Repo</a>` : ''}
      </div>
    </div>
  `;
}

// Function to render projects into a container
function renderProjects(containerSelector, featuredOnly) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.warn(`Project container not found: ${containerSelector}`);
    return;
  }

  // Ensure projectsData is loaded
  if (typeof projectsData === 'undefined') {
    console.error('projectsData is not loaded. Make sure projects-data.js is included before script.js');
    container.innerHTML = '<p class="error-message">Could not load project data.</p>';
    return;
  }

  const projectsToRender = featuredOnly 
    ? projectsData.filter(project => project.featured)
    : projectsData;

  if (projectsToRender.length === 0) {
    container.innerHTML = '<p>No projects to display at the moment.</p>';
    return;
  }

  container.innerHTML = projectsToRender.map(createProjectCard).join('');
}