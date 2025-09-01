
let currentProject = 0;
let projects = [];
let userProfile = {};

async function fetchGitHubData() {
    try {
        const [reposResponse, profileResponse] = await Promise.all([
            fetch('https://api.github.com/users/brenolobao/repos?sort=updated&per_page=10'),
            fetch('https://api.github.com/users/brenolobao')
        ]);

        if (!reposResponse.ok || !profileResponse.ok) {
            throw new Error('Erro ao buscar dados do GitHub');
        }

        projects = await reposResponse.json();
        userProfile = await profileResponse.json();

        displayProjects();
        document.getElementById('projects-loading').style.display = 'none';
        document.getElementById('projects-carousel').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        document.getElementById('projects-loading').innerHTML = `
                    <div style="text-align: center; color: var(--text-secondary);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <p>Não foi possível carregar os projetos do GitHub</p>
                    </div>
                `;
    }
}

function displayProjects() {
    const container = document.querySelector('.projects-container');
    container.innerHTML = '';

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const languages = project.language || 'JavaScript';
        const description = project.description || 'Projeto desenvolvido com foco em aprendizado e prática.';

        card.innerHTML = `
                    <div class="project-header">
                        <div class="project-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <h3 class="project-title">${project.name}</h3>
                    </div>
                    <p class="project-description">${description}</p>
                    <div class="project-stats">
                        <div class="stat">
                            <i class="fas fa-star"></i>
                            <span>${project.stargazers_count}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-code-branch"></i>
                            <span>${project.forks_count}</span>
                        </div>
                        <div class="stat">
                            <i class="fas fa-circle" style="color: #f1c40f;"></i>
                            <span>${languages}</span>
                        </div>
                    </div>
                    <div class="project-links">
                        <a href="${project.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                            Ver Código
                        </a>
                        ${project.homepage ? `
                            <a href="${project.homepage}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i>
                                Demo
                            </a>
                        ` : ''}
                    </div>
                `;

        container.appendChild(card);
    });

    updateCarousel();
}

function nextProject() {
    if (currentProject < Math.max(0, projects.length - 3)) {
        currentProject++;
        updateCarousel();
    }
}

function previousProject() {
    if (currentProject > 0) {
        currentProject--;
        updateCarousel();
    }
}

function updateCarousel() {
    const container = document.querySelector('.projects-container');
    const cardWidth = 350 + 32;
    container.style.transform = `translateX(-${currentProject * cardWidth}px)`;

    const prevBtn = document.querySelector('.carousel-nav .carousel-btn:first-child');
    const nextBtn = document.querySelector('.carousel-nav .carousel-btn:last-child');

    prevBtn.disabled = currentProject === 0;
    nextBtn.disabled = currentProject >= Math.max(0, projects.length - 3);
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle i').className = 'fas fa-sun';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    fetchGitHubData();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.background = 'var(--bg-card)';
        }
    });
});