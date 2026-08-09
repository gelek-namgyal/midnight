document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });

    // Get all sidebar menu items and content sections
    const menuItems = document.querySelectorAll('.sidebar .icon:not(.theme-toggle):not(.github-link):not(.keyboard-shortcuts-btn)');
    const files = document.querySelectorAll('.file');
    const contentSections = document.querySelectorAll('.content-section');
    const themeToggle = document.querySelector('.theme-toggle');
    const githubLink = document.querySelector('.github-link');
    const keyboardShortcutsBtn = document.querySelector('.keyboard-shortcuts-btn');

    // Theme Toggle Functionality
    function toggleTheme(e) {
        e.preventDefault();
        e.stopPropagation();
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Add click handler for theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // GitHub Link Handler
    if (githubLink) {
        githubLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open('https://github.com/your-username', '_blank');
        });
    }

    // Keyboard Shortcuts Handler
    if (keyboardShortcutsBtn) {
        keyboardShortcutsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove existing help if present
            const existingHelp = document.querySelector('.keyboard-shortcuts');
            if (existingHelp) {
                existingHelp.remove();
                return;
            }
            
            const shortcutsHelp = document.createElement('div');
            shortcutsHelp.className = 'keyboard-shortcuts';
            shortcutsHelp.innerHTML = `
                <h4>Keyboard Shortcuts</h4>
                <ul>
                    <li><kbd>Alt</kbd> + <kbd>1</kbd> - About</li>
                    <li><kbd>Alt</kbd> + <kbd>2</kbd> - Education</li>
                    <li><kbd>Alt</kbd> + <kbd>3</kbd> - Experience</li>
                    <li><kbd>Alt</kbd> + <kbd>4</kbd> - Projects</li>
                    <li><kbd>Alt</kbd> + <kbd>5</kbd> - Services</li>
                    <li><kbd>Alt</kbd> + <kbd>6</kbd> - Skills</li>
                    <li><kbd>Alt</kbd> + <kbd>7</kbd> - Contact</li>
                    <li><kbd>Alt</kbd> + <kbd>S</kbd> - Search</li>
                    <li><kbd>Alt</kbd> + <kbd>P</kbd> - Print Resume</li>
                    <li><kbd>Alt</kbd> + <kbd>H</kbd> - Share Portfolio</li>
                </ul>
            `;
            
            document.body.appendChild(shortcutsHelp);
            
            // Close help when clicking outside
            const closeHelp = (e) => {
                if (!shortcutsHelp.contains(e.target) && e.target !== keyboardShortcutsBtn) {
                    shortcutsHelp.remove();
                    document.removeEventListener('click', closeHelp);
                }
            };
            
            // Add a small delay before adding the click listener to prevent immediate closing
            setTimeout(() => {
                document.addEventListener('click', closeHelp);
            }, 100);
        });
    }

    // Function to show content
    function showContent(contentId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show selected content
        const selectedContent = document.getElementById(contentId);
        if (selectedContent) {
            selectedContent.classList.add('active');
            selectedContent.style.display = 'block';
        }

        // Update active states
        files.forEach(file => {
            file.classList.remove('active');
            if (file.getAttribute('data-content') === contentId) {
                file.classList.add('active');
            }
        });

        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('title').toLowerCase() === contentId) {
                item.classList.add('active');
            }
        });
    }

    // Add click handlers to sidebar menu items
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const contentId = item.getAttribute('title').toLowerCase();
            showContent(contentId);
        });
    });

    // Add click handlers to file items
    files.forEach(file => {
        file.addEventListener('click', () => {
            const contentId = file.getAttribute('data-content');
            showContent(contentId);
        });
    });

    // Initially show about section
    showContent('about');

    // Add this function after the showContent function
    function navigateToSection(sectionId) {
        showContent(sectionId);
    }

    // Update the keyboard shortcuts section
    document.addEventListener('keydown', (e) => {
        // Alt + Number shortcuts for navigation
        if (e.altKey && !isNaN(e.key) && e.key > 0 && e.key <= 7) {
            const sections = ['about', 'education', 'experience', 'projects', 'services', 'skills', 'contact'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                navigateToSection(sections[index]);
            }
        }
        
        // Alt + S for search
        if (e.altKey && e.key.toLowerCase() === 's') {
            toggleSearch();
        }
        
        // Alt + P for print resume
        if (e.altKey && e.key.toLowerCase() === 'p') {
            printResume();
        }
        
        // Alt + H for share
        if (e.altKey && e.key.toLowerCase() === 'h') {
            sharePortfolio();
        }
    });
});

// Search Functionality
function toggleSearch() {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-header">
                <h3>Search Portfolio</h3>
                <button class="close-search"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-input-container">
                <input type="text" placeholder="Type to search..." class="search-input">
                <i class="fas fa-search"></i>
            </div>
            <div class="search-results"></div>
            <div class="search-shortcuts">
                <p>Press <kbd>Esc</kbd> to close</p>
                <p>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate results</p>
                <p>Press <kbd>Enter</kbd> to select</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(searchOverlay);
    const searchInput = searchOverlay.querySelector('.search-input');
    searchInput.focus();
    
    // Close search on escape
    document.addEventListener('keydown', function closeSearch(e) {
        if (e.key === 'Escape') {
            searchOverlay.remove();
            document.removeEventListener('keydown', closeSearch);
        }
    });
    
    // Close button
    searchOverlay.querySelector('.close-search').addEventListener('click', () => {
        searchOverlay.remove();
    });
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const results = searchPortfolio(query);
        displaySearchResults(results, searchOverlay.querySelector('.search-results'));
    });
}

function searchPortfolio(query) {
    const sections = ['about', 'education', 'experience', 'projects', 'services', 'skills', 'contact'];
    const results = [];
    
    sections.forEach(section => {
        const content = document.querySelector(`#${section}`);
        if (content) {
            const text = content.textContent.toLowerCase();
            if (text.includes(query)) {
                results.push({
                    section,
                    title: section.charAt(0).toUpperCase() + section.slice(1),
                    preview: getPreviewText(text, query)
                });
            }
        }
    });
    
    return results;
}

function getPreviewText(text, query) {
    const index = text.indexOf(query);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    return '...' + text.slice(start, end) + '...';
}

function displaySearchResults(results, container) {
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }
    
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result';
        resultElement.innerHTML = `
            <h4>${result.title}</h4>
            <p>${result.preview}</p>
        `;
        resultElement.addEventListener('click', () => {
            navigateToSection(result.section);
            document.querySelector('.search-overlay').remove();
        });
        container.appendChild(resultElement);
    });
}

// Print Resume Function
function printResume() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Gelek Namgyal - Resume</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    h1, h2, h3 {
                        color: #333;
                    }
                    .contact-info {
                        margin: 20px 0;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Gelek Namgyal</h1>
                    <p>Web Developer</p>
                    <div class="contact-info">
                        <p>Email: your.email@example.com</p>
                        <p>Phone: +1 (234) 567-890</p>
                        <p>Location: 123 Main St, City, Country</p>
                    </div>
                </div>
                <div class="section">
                    <h2>Education</h2>
                    <h3>Bachelor of Computer Application</h3>
                    <p>Asian college of higher studies</p>
                    <p>Ekantakuna, Lalitpur</p>
                    <p>Running</p>
                </div>
                <div class="section">
                    <h2>Skills</h2>
                    <p>HTML5, CSS3, JavaScript, PHP, MySQL, React, Node.js</p>
                </div>
                <div class="section">
                    <h2>Projects</h2>
                    <h3>Bus Reservation System</h3>
                    <p>A complete bus booking solution with real-time seat selection, ticket management, and admin dashboard.</p>
                    <h3>Bookstore Management</h3>
                    <p>Digital bookstore platform with inventory management, user reviews, and shopping cart functionality.</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Share Portfolio Function
function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'Gelek Namgyal - Portfolio',
            text: 'Check out my portfolio website!',
            url: window.location.href
        })
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.href;
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        // Show copied notification
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = 'Portfolio URL copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize EmailJS
(function() {
    emailjs.init("public_key_7YwXKqQZqQZqQZqQ"); // This is a placeholder key
})();

// Contact Form Handler
async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        const templateParams = {
            from_name: form.name.value,
            from_email: form.email.value,
            message: form.message.value,
            to_email: 'geleknamgyal51@gmail.com'
        };
        
        // Send email using EmailJS
        const response = await emailjs.send(
            'service_7YwXKqQZqQZqQZqQ', // Replace with your service ID
            'template_7YwXKqQZqQZqQZqQ', // Replace with your template ID
            templateParams
        );
        
        if (response.status === 200) {
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Message sent successfully! I'll get back to you soon.
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
            
            // Reset form
            form.reset();
        } else {
            throw new Error('Failed to send email');
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Show error message
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Failed to send message. Please try again or email me directly at geleknamgyal51@gmail.com
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
    
    return false;
}
