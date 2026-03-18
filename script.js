document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu
    const burger = document.getElementById('burger');
    const navRight = document.querySelector('.nav-right');

    burger.addEventListener('click', () => {
        navRight.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
        link.addEventListener('click', () => navRight.classList.remove('open'));
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) {
                window.scrollTo({
                    top: t.getBoundingClientRect().top + window.scrollY - 72,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal on scroll
    const els = document.querySelectorAll(
        '.bento-item, .process-item, .member, .hero-card, .form, .about-text'
    );
    els.forEach(el => el.classList.add('reveal'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
                const i = siblings.indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));

    // Form — envia via Formspree
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'A enviar...';
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(r => {
            if (r.ok) {
                btn.textContent = 'Mensagem enviada!';
                btn.style.background = '#16a34a';
                form.reset();
            } else {
                btn.textContent = 'Erro — tente novamente';
                btn.style.background = '#dc2626';
            }
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }).catch(() => {
            btn.textContent = 'Erro — tente novamente';
            btn.style.background = '#dc2626';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
});
