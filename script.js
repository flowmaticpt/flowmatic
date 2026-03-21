document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu
    const burger = document.getElementById('burger');
    const navRight = document.getElementById('navRight');

    burger.addEventListener('click', () => {
        const isOpen = navRight.classList.toggle('open');
        burger.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            navRight.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Nav shadow + scroll-to-top
    const nav = document.querySelector('.nav');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 50);
        scrollTopBtn.classList.toggle('visible', y > 600);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Reveal on scroll
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const revealEls = document.querySelectorAll(
            '.service-row, .step, .team-card, .number-block, .form, .contact-left'
        );
        revealEls.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
                    const i = siblings.indexOf(entry.target);
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealEls.forEach(el => observer.observe(el));
    }

    // i18n
    const translations = {
        pt: {
            title: 'Flowmatica \u2014 Automatiza\u00e7\u00e3o de Processos',
            metaDesc: 'Automatizamos tarefas repetitivas para PMEs portuguesas.',
            navServicos: 'Servi\u00e7os',
            navProcesso: 'Processo',
            navEquipa: 'Equipa',
            navCta: 'Marcar reuni\u00e3o',
            heroBadge: 'Feito em Portugal',
            heroTitle: 'A sua empresa ainda perde horas em tarefas que podiam ser <em>autom\u00e1ticas</em>?',
            heroDesc: 'Cobran\u00e7as enviadas \u00e0 m\u00e3o. Dados copiados de um sistema para outro. Documentos preenchidos um a um. N\u00f3s eliminamos esse trabalho \u2014 para que a sua equipa se foque no que realmente importa.',
            heroCardBtn: 'Agendar reuni\u00e3o',
            heroCardDesc: 'Diagn\u00f3stico gratuito de 30\u00a0min \u00b7 Sem compromisso',
            svcLabel: 'Servi\u00e7os',
            svcTitle: 'O que automatizamos',
            svcEscolaTag: 'Escolas de Condu\u00e7\u00e3o',
            svcEscolaTitle: 'Marca\u00e7\u00f5es, alunos e comunica\u00e7\u00e3o \u2014 tudo organizado sem esfor\u00e7o.',
            svcEscolaItems: ['Website profissional para a escola', 'Sistema de marca\u00e7\u00e3o de aulas online', 'Lembretes autom\u00e1ticos de aulas e exames', 'Ficha digital de cada aluno', 'Notifica\u00e7\u00f5es por email e WhatsApp'],
            svcClinicTag: 'Cl\u00ednicas',
            svcClinicTitle: 'Consultas organizadas, pacientes informados.',
            svcClinicItems: ['Website com servi\u00e7os e equipa', 'Agendamento online de consultas', 'Lembretes por SMS e WhatsApp', 'Fichas digitais de pacientes'],
            svcGymTag: 'Gin\u00e1sios',
            svcGymTitle: 'Membros, hor\u00e1rios e pagamentos sob controlo.',
            svcGymItems: ['Website com hor\u00e1rios e planos', 'Inscri\u00e7\u00f5es online', 'Lembretes de renova\u00e7\u00e3o de mensalidade', 'Comunica\u00e7\u00e3o autom\u00e1tica com membros'],
            svcOutroTitle: 'Outro setor?',
            svcOutroDesc: 'Se tem tarefas repetitivas ou precisa de um website, provavelmente conseguimos ajudar.',
            svcOutroLink: 'Fale connosco \u2192',
            proofStat1: 'empresas confiam em n\u00f3s',
            proofStat2: 'alunos geridos',
            proofStat3: 'empresas contactadas',
            procLabel: 'Processo',
            procTitle: 'Como trabalhamos',
            proc1Title: 'Conversamos',
            proc1Desc: '30 minutos, presencial ou videochamada. Percebemos o dia-a-dia da empresa, que tarefas consomem tempo e que ferramentas usam.',
            proc1Detail: 'Gratuito, sem compromisso',
            proc2Title: 'Propomos',
            proc2Desc: 'Em 48 horas enviamos uma proposta clara \u2014 o que vamos automatizar, como funciona e quanto custa. Sem letras pequenas.',
            proc2Detail: 'Proposta em 48h',
            proc3Title: 'Entregamos',
            proc3Desc: 'Constru\u00edmos, testamos consigo e pomos tudo a funcionar. Damos forma\u00e7\u00e3o \u00e0 equipa e ficamos dispon\u00edveis para qualquer ajuste.',
            proc3Detail: 'Suporte inclu\u00eddo',
            teamLabel: 'Quem somos',
            teamTitle: 'Tecnologia e gest\u00e3o, a trabalhar juntos.',
            teamDesc: 'Somos dois jovens com forma\u00e7\u00e3o em Engenharia Inform\u00e1tica e Gest\u00e3o. Lan\u00e7\u00e1mos a Flowmatica porque vemos todos os dias empresas a perder horas em tarefas que podiam ser resolvidas com tecnologia simples. Sem buzzwords, sem complica\u00e7\u00f5es \u2014 solu\u00e7\u00f5es pr\u00e1ticas que funcionam.',
            memberRBRole: 'Engenharia Inform\u00e1tica',
            memberRBDesc: 'Respons\u00e1vel pela parte t\u00e9cnica \u2014 desenvolvimento, integra\u00e7\u00f5es e automa\u00e7\u00f5es.',
            memberVTRole: 'Gest\u00e3o',
            memberVTDesc: 'Respons\u00e1vel pela an\u00e1lise de processos, rela\u00e7\u00e3o com clientes e estrat\u00e9gia.',
            contactLabel: 'Contacto',
            contactTitle: 'Agende um diagn\u00f3stico gratuito.',
            contactDesc: 'Sem custos, sem compromisso. Reunimos consigo para perceber o seu neg\u00f3cio e mostrar como podemos ajudar. Se fizer sentido, avan\u00e7amos. Se n\u00e3o, fica com ideias \u00fateis na mesma.',
            formNome: 'Nome *',
            formEmpresa: 'Empresa',
            formMensagem: 'O que gostaria de automatizar?',
            formBtn: 'Agendar reuni\u00e3o gratuita',
            formNote: 'Respondemos em menos de 24\u00a0horas.',
            scrollTopLabel: 'Voltar ao topo',
            footer: '\u00a9 2026 Flowmatica'
        },
        en: {
            title: 'Flowmatica \u2014 Process Automation',
            metaDesc: 'We automate repetitive tasks for businesses.',
            navServicos: 'Services',
            navProcesso: 'Process',
            navEquipa: 'Team',
            navCta: 'Book a meeting',
            heroBadge: 'Made in Portugal',
            heroTitle: 'Is your company still wasting hours on tasks that could be <em>automated</em>?',
            heroDesc: 'Invoices sent by hand. Data copied from one system to another. Documents filled out one by one. We eliminate that work \u2014 so your team can focus on what really matters.',
            heroCardBtn: 'Book a meeting',
            heroCardDesc: 'Free 30\u2011min assessment \u00b7 No commitment',
            svcLabel: 'Services',
            svcTitle: 'What we automate',
            svcEscolaTag: 'Driving Schools',
            svcEscolaTitle: 'Bookings, students and communication \u2014 all organized effortlessly.',
            svcEscolaItems: ['Professional website for your school', 'Online lesson booking system', 'Automatic lesson and exam reminders', 'Digital student records', 'Email and WhatsApp notifications'],
            svcClinicTag: 'Clinics',
            svcClinicTitle: 'Organized appointments, informed patients.',
            svcClinicItems: ['Website with services and team', 'Online appointment scheduling', 'SMS and WhatsApp reminders', 'Digital patient records'],
            svcGymTag: 'Gyms',
            svcGymTitle: 'Members, schedules and payments under control.',
            svcGymItems: ['Website with schedules and plans', 'Online sign-ups', 'Membership renewal reminders', 'Automatic member communication'],
            svcOutroTitle: 'Another industry?',
            svcOutroDesc: 'If you have repetitive tasks or need a website, we can probably help.',
            svcOutroLink: 'Get in touch \u2192',
            proofStat1: 'companies trust us',
            proofStat2: 'students managed',
            proofStat3: 'businesses contacted',
            procLabel: 'Process',
            procTitle: 'How we work',
            proc1Title: 'We talk',
            proc1Desc: '30 minutes, in person or video call. We learn about your day-to-day, which tasks take up time, and what tools you use.',
            proc1Detail: 'Free, no commitment',
            proc2Title: 'We propose',
            proc2Desc: 'Within 48 hours we send a clear proposal \u2014 what we\u2019ll automate, how it works, and how much it costs. No fine print.',
            proc2Detail: 'Proposal in 48h',
            proc3Title: 'We deliver',
            proc3Desc: 'We build, test with you, and get everything running. We train your team and stay available for any adjustments.',
            proc3Detail: 'Support included',
            teamLabel: 'About us',
            teamTitle: 'Technology and management, working together.',
            teamDesc: 'We\u2019re two young professionals with backgrounds in Computer Engineering and Management. We started Flowmatica because we see businesses losing hours every day on tasks that could be solved with simple technology. No buzzwords, no complications \u2014 practical solutions that work.',
            memberRBRole: 'Computer Engineering',
            memberRBDesc: 'Responsible for the technical side \u2014 development, integrations and automations.',
            memberVTRole: 'Management',
            memberVTDesc: 'Responsible for process analysis, client relations and strategy.',
            contactLabel: 'Contact',
            contactTitle: 'Book a free assessment.',
            contactDesc: 'No cost, no commitment. We\u2019ll meet with you to understand your business and show how we can help. If it makes sense, we move forward. If not, you still walk away with useful ideas.',
            formNome: 'Name *',
            formEmpresa: 'Company',
            formMensagem: 'What would you like to automate?',
            formBtn: 'Book a free meeting',
            formNote: 'We respond within 24\u00a0hours.',
            scrollTopLabel: 'Back to top',
            footer: '\u00a9 2026 Flowmatica'
        }
    };

    function setLanguage(lang) {
        const t = translations[lang];
        if (!t) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (!(key in t)) return;
            if (el.dataset.i18nAttr) {
                el.setAttribute(el.dataset.i18nAttr, t[key]);
            } else if (el.tagName === 'TITLE') {
                document.title = t[key];
            } else {
                el.innerHTML = t[key];
            }
        });

        document.querySelectorAll('[data-i18n-list]').forEach(ul => {
            const key = ul.dataset.i18nList;
            const items = t[key];
            if (!items) return;
            ul.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
        });

        document.getElementById('htmlRoot').setAttribute('lang', lang === 'pt' ? 'pt-PT' : 'en');
        const btn = document.getElementById('langToggle');
        btn.textContent = lang === 'pt' ? 'EN' : 'PT';
        localStorage.setItem('flowmatica-lang', lang);
    }

    document.getElementById('langToggle').addEventListener('click', () => {
        const current = localStorage.getItem('flowmatica-lang') || 'pt';
        setLanguage(current === 'pt' ? 'en' : 'pt');
    });

    const savedLang = localStorage.getItem('flowmatica-lang');
    if (savedLang && savedLang !== 'pt') setLanguage(savedLang);
});
