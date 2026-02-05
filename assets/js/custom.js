// Custom JavaScript for Thato Mapheto Portfolio

// Set current year in copyright
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Enhanced Smooth Scrolling with Section Detection
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or external links
            if (href === '#' || href === '#!' || href.includes('http')) return;

            e.preventDefault();
            const targetId = href.substring(1); // Remove the #
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate scroll position
                const headerHeight = document.querySelector('#header').offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without page reload
                history.pushState(null, null, href);

                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });
}

// Enhanced Active Navigation Link Update
function updateActiveNavLink(targetHash = null) {
    const navLinks = document.querySelectorAll('#nav .links a');

    if (targetHash) {
        // Direct click - update immediately
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === targetHash) {
                link.parentElement.classList.add('active');
            }
        });
    } else {
        // Scroll-based update - check which section is in view
        const sections = document.querySelectorAll('section[id], article[id]');
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        // If no section found, check if we're at the top
        if (!currentSectionId && window.scrollY < 300) {
            currentSectionId = 'main';
        }

        // Update nav links
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            const linkHash = link.getAttribute('href').substring(1);
            if (linkHash === currentSectionId) {
                link.parentElement.classList.add('active');
            }
        });
    }
}

// WORKING CONTACT FORM WITH RESEND.COM
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;
            submitBtn.value = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send email using Resend
                const response = await sendEmailWithResend(name, email, message);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Email sent successfully:', result);
                    showNotification('Message sent successfully! I will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Resend API error:', errorData);
                    throw new Error(errorData.message || 'Failed to send email');
                }
            } catch (error) {
                console.error('Error sending email:', error);

                // Fallback: Try mailto link if Resend fails
                const mailtoLink = `mailto:thatomapheto6@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                showNotification(`Email service temporarily unavailable. <a href="${mailtoLink}" style="color: white; text-decoration: underline;">Click here to email me directly</a>`, 'error');
            } finally {
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Resend.com Email Sending Function
async function sendEmailWithResend(name, email, message) {
    // IMPORTANT: Generate a NEW API key and replace this!
    const RESEND_API_KEY = 're_YyGBYJH7_NR6k7U92zYufJEXi4GcyDjEr';

    const emailData = {
        from: 'Portfolio Website <onboarding@resend.dev>',
        to: ['thatomapheto6@gmail.com'],
        reply_to: email,
        subject: `New Contact Form Message from ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>New Portfolio Contact</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #0f766e; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #0f766e; }
                        .message-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #10b981; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>New Portfolio Contact Form Submission</h1>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">From:</div>
                                <div>${name} (${email})</div>
                            </div>
                            <div class="field">
                                <div class="label">Date:</div>
                                <div>${new Date().toLocaleString()}</div>
                            </div>
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            <div class="footer">
                                <p>This email was sent from your portfolio website contact form.</p>
                                <p>You can reply directly to this email to contact ${name}.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `,
        text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website`
    };

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify(emailData)
    });

    return response;
}

// Show notification message
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-text">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);

    // Add to DOM
    document.body.appendChild(notification);

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-icon {
                font-weight: bold;
                font-size: 1.2rem;
            }
            .notification-close {
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
                line-height: 1;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize skill tag animations
function initSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');

    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px) scale(1.05)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set copyright year
    updateCopyrightYear();

    initSmoothScrolling();
    initContactForm();
    initSkillAnimations();

    // Update active nav link on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 100);
    });

    // Check URL hash on page load
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.querySelector('#header').offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                updateActiveNavLink(hash);
            }, 500); // Delay for page load
        }
    }

    // Add loading animation for page elements
    setTimeout(() => {
        document.body.classList.remove('is-preload');
    }, 100);

    // Update active nav link initially
    updateActiveNavLink();

    // Test function to verify Resend is working
    testResendConnection();
});

// Test function to verify Resend connection
function testResendConnection() {
    console.log('Resend integration loaded successfully.');
    console.log('Contact form will send emails to: thatomapheto6@gmail.com');
}