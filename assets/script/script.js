// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
	a.addEventListener('click', e => {
		e.preventDefault();
		const t = document.querySelector(a.getAttribute('href'));
		if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			observer.unobserve(entry.target);
		}
	});
}, {
	threshold: 0,        // ← change from 0.1 to 0
	rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form
const form = document.getElementById('simple-contact');
if (form) {
	form.addEventListener('submit', e => {
		e.preventDefault();
		alert('Thank you for reaching out! I will respond within 24 hours.');
		form.reset();
	});
}