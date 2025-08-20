    class GoCodeApp {
        constructor() {
            this.currentPage = 'home';
            this.isDarkMode = this.getInitialTheme();
            this.isAuthenticated = false;
            this.user = null;
        

            this.init();
        }

        init() {
            this.initTheme();
            this.initEventListeners();
            this.initIcons();
            this.renderFeaturedCourses();
            this.renderAllCourses();
            this.renderEnrolledCourses();
            this.animateOnLoad();
        }

        getInitialTheme() {
            const saved = localStorage.getItem('gocode-theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        initTheme() {
            if (this.isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('gocode-theme', this.isDarkMode ? 'dark' : 'light');
        }

        initEventListeners() {
            // Navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const page = e.currentTarget.dataset.page;
                    if (page) {
                        this.navigateTo(page);
                    }
                });
            });

            // Navigation buttons
            document.querySelectorAll('[data-navigate]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const page = e.currentTarget.dataset.navigate;
                    this.navigateTo(page);
                });
            });

            // Theme toggle
            document.getElementById('theme-toggle').addEventListener('click', () => {
                this.toggleTheme();
            });

            // Auth button
            document.getElementById('auth-button').addEventListener('click', () => {
                this.mockLogin();
            });

            // Contact form
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleContactForm(e);
                });
            }

            // Course filters
            const courseSearch = document.getElementById('course-search');
            const categoryFilter = document.getElementById('category-filter');
            const difficultyFilter = document.getElementById('difficulty-filter');

            if (courseSearch) {
                courseSearch.addEventListener('input', () => this.filterCourses());
            }
            if (categoryFilter) {
                categoryFilter.addEventListener('change', () => this.filterCourses());
            }
            if (difficultyFilter) {
                difficultyFilter.addEventListener('change', () => this.filterCourses());
            }

            // Mobile menu toggle (for responsive design)
            this.initMobileMenu();

            // New feature button
            document.getElementById('new-feature-button').addEventListener('click', () => {
                alert('New Feature Coming Soon!');
            });
        }

        initIcons() {
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }

        initMobileMenu() {
            // Add mobile menu button for responsive design
            const header = document.querySelector('.app-header');
            if (window.innerWidth <= 1024) {
                const menuButton = document.createElement('button');
                menuButton.className = 'icon-button mobile-menu-toggle';
                menuButton.innerHTML = '<i data-lucide="menu"></i>';
                menuButton.addEventListener('click', () => {
                    document.querySelector('.sidebar').classList.toggle('open');
                });
                header.insertBefore(menuButton, header.firstChild);
            }
        }

        navigateTo(page) {
            if (page === 'login' && !this.isAuthenticated) {
                this.mockLogin();
                return;
            }

            if ((page === 'dashboard' || page === 'profile') && !this.isAuthenticated) {
                this.mockLogin();
                return;
            }

            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
            if (activeNav) {
                activeNav.classList.add('active');
            }

            // Update pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
            });

            const targetPage = document.getElementById(`${page}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                this.currentPage = page;
                this.animatePageTransition(targetPage);
            }

            // Re-initialize icons for new content
            setTimeout(() => {
                this.initIcons();
            }, 100);
        }

        toggleTheme() {
            this.isDarkMode = !this.isDarkMode;
            this.initTheme();
        }

        mockLogin() {
            this.isAuthenticated = true;
            this.user = {
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
            };

            // Update UI
            document.getElementById('auth-button').classList.add('hidden');
            document.getElementById('user-profile').classList.remove('hidden');
            document.getElementById('user-first-name').textContent = this.user.name.split(' ')[0];

            this.showToast('Welcome to GoCode! You are now signed in.', 'success');
            this.navigateTo('dashboard');
        }

        renderFeaturedCourses() {
            const container = document.getElementById('featured-courses-grid');
            if (!container) return;

            const featuredCourses = this.courses.filter(course => course.featured);
            container.innerHTML = featuredCourses.map(course => this.createCourseCard(course)).join('');
        }

        renderAllCourses() {
            const container = document.getElementById('courses-grid');
            if (!container) return;

            container.innerHTML = this.courses.map(course => this.createCourseCard(course, true)).join('');
        }

        filterCourses() {
            const searchQuery = document.getElementById('course-search')?.value.toLowerCase() || '';
            const categoryFilter = document.getElementById('category-filter')?.value || 'all';
            const difficultyFilter = document.getElementById('difficulty-filter')?.value || 'all';

            const filteredCourses = this.courses.filter(course => {
                const matchesSearch = course.title.toLowerCase().includes(searchQuery) ||
                                    course.description.toLowerCase().includes(searchQuery);
                const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
                const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
                
                return matchesSearch && matchesCategory && matchesDifficulty;
            });

            const container = document.getElementById('courses-grid');
            if (container) {
                if (filteredCourses.length === 0) {
                    container.innerHTML = `
                        <div class="no-results">
                            <p>No courses found matching your criteria.</p>
                            <button class="btn btn-outline" onclick="app.clearFilters()">Clear Filters</button>
                        </div>
                    `;
                } else {
                    container.innerHTML = filteredCourses.map(course => this.createCourseCard(course, true)).join('');
                }
            }
        }

        clearFilters() {
            const courseSearch = document.getElementById('course-search');
            const categoryFilter = document.getElementById('category-filter');
            const difficultyFilter = document.getElementById('difficulty-filter');

            if (courseSearch) courseSearch.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (difficultyFilter) difficultyFilter.value = 'all';

            this.renderAllCourses();
        }

        createCourseCard(course, showEnrollButton = false) {
            const stars = '★'.repeat(Math.floor(course.rating)) + '☆'.repeat(5 - Math.floor(course.rating));
            
            return `
                <div class="course-card" data-course-id="${course.id}">
                    <div style="position: relative;">
                        <img src="${course.image}" alt="${course.title}" class="course-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvdXJzZSBJbWFnZTwvdGV4dD48L3N2Zz4='">
                        ${course.featured ? '<div class="course-featured">Featured</div>' : ''}
                    </div>
                    <div class="course-info">
                        <div class="course-header">
                            <div class="course-category">${this.getCategoryName(course.category)}</div>
                            <div class="course-difficulty ${course.difficulty}">${course.difficulty}</div>
                        </div>
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <div class="course-meta">
                            <div class="course-meta-item">
                                <i data-lucide="clock"></i>
                                ${course.duration}
                            </div>
                            <div class="course-meta-item">
                                <i data-lucide="users"></i>
                                ${course.students.toLocaleString()}
                            </div>
                        </div>
                        <div class="course-footer">
                            <div class="course-rating">
                                <i data-lucide="star" style="color: #fbbf24; fill: currentColor;"></i>
                                <span class="course-rating-value">${course.rating}</span>
                                <span class="course-rating-lessons">(${course.lessons} lessons)</span>
                            </div>
                            ${showEnrollButton ? '<button class="btn btn-primary" onclick="app.enrollInCourse(\'' + course.id + '\')">Enroll</button>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        renderEnrolledCourses() {
            const container = document.getElementById('enrolled-courses');
            if (!container) return;

            container.innerHTML = this.enrolledCourses.map(course => `
                <div class="enrolled-course">
                    <img src="${course.image}" alt="${course.title}" class="course-thumbnail" loading="lazy">
                    <div class="enrolled-course-info">
                        <div class="enrolled-course-header">
                            <h4 class="enrolled-course-title">${course.title}</h4>
                            <div class="enrolled-course-status ${course.status}">
                                ${course.status === 'completed' ? 'Completed' : 'In Progress'}
                            </div>
                        </div>
                        <div class="progress-info">
                            <span>Progress: ${course.completedLessons}/${course.totalLessons} lessons</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${course.progress}%"></div>
                        </div>
                        <div class="enrolled-course-footer">
                            <div class="next-lesson">
                                ${course.status === 'completed' ? '🎉 Course completed!' : `Next: ${course.nextLesson}`}
                            </div>
                            <button class="btn btn-primary">
                                <i data-lucide="play"></i>
                                ${course.status === 'completed' ? 'Review' : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        getCategoryName(category) {
            const categories = {
                'programming': 'Programming Languages',
                'computer-science': 'Computer Science',
                'fundamentals': 'Fundamentals'
            };
            return categories[category] || category;
        }

        enrollInCourse(courseId) {
            const course = this.courses.find(c => c.id === courseId);
            if (course) {
                this.showToast(`Successfully enrolled in ${course.title}!`, 'success');
            }
        }

        handleContactForm(e) {
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Simulate form submission
            this.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
        }

        showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type} fade-in`;
            
            const icon = type === 'success' ? 'check-circle' : 'alert-circle';
            toast.innerHTML = `
                <i data-lucide="${icon}"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);
            
            // Initialize icon
            setTimeout(() => {
                this.initIcons();
            }, 10);

            // Auto remove after 4 seconds
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, 4000);
        }

        animateOnLoad() {
            // Add fade-in animation to page elements
            const elements = document.querySelectorAll('.hero-section, .stats-section, .featured-courses, .page-header');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('fade-in');
                }, index * 100);
            });
        }

        animatePageTransition(page) {
            page.classList.add('slide-up');
            setTimeout(() => {
                page.classList.remove('slide-up');
            }, 500);
        }

        // Utility method for responsive sidebar
        handleResize() {
            if (window.innerWidth > 1024) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        }
    }

    // Initialize the app
    let app;
    document.addEventListener('DOMContentLoaded', () => {
        app = new GoCodeApp();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            app.handleResize();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            document.querySelector('.sidebar').classList.remove('open');
        }
    });

    // Service Worker for offline functionality (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Lazy loading for images
    document.addEventListener('DOMContentLoaded', () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    });

    // Export for use in HTML
    window.GoCodeApp = GoCodeApp;