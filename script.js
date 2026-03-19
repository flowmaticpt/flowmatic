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

    // Form — submissao nativa para Formspree (sem JS override)

    // ============================================
    // i18n — Language toggle PT / EN
    // ============================================

    const translations = {
        pt: {
            title: 'Flowmatic \u2014 Automatiza\u00e7\u00e3o de Processos',
            metaDesc: 'Automatizamos tarefas repetitivas para empresas portuguesas.',

            // Nav
            navServicos: 'Servi\u00e7os',
            navProcesso: 'Processo',
            navEquipa: 'Equipa',
            navCta: 'Marcar reuni\u00e3o',

            // Hero
            heroTitle: 'A sua empresa ainda perde<br>horas em tarefas que podiam<br>ser <em>autom\u00e1ticas</em>?',
            heroDesc: 'Cobran\u00e7as enviadas \u00e0 m\u00e3o. Dados copiados de um sistema para outro. Documentos preenchidos um a um. N\u00f3s eliminamos esse trabalho \u2014 para que a sua equipa se foque no que realmente importa.',
            heroCardTitle: 'Diagn\u00f3stico gratuito de 30 min',
            heroCardDesc: 'Analisamos os seus processos e mostramos o que pode ser automatizado. Sem custos, sem compromisso.',
            heroCardBtn: 'Agendar reuni\u00e3o',

            // Services
            svcLabel: 'Servi\u00e7os',
            svcTitle: 'O que automatizamos',
            svcCondoTag: 'Gest\u00e3o de Condom\u00ednios',
            svcCondoTitle: 'Cobran\u00e7as, recibos, atas e comunica\u00e7\u00e3o com cond\u00f3minos \u2014 tudo no piloto autom\u00e1tico.',
            svcCondoItems: [
                'Envio autom\u00e1tico de avisos de pagamento',
                'Recibos gerados e enviados sem interven\u00e7\u00e3o',
                'Atas criadas a partir de templates',
                'Notifica\u00e7\u00f5es por email e WhatsApp',
                'Painel com o estado de cada condom\u00ednio'
            ],
            svcContabTag: 'Contabilidade',
            svcContabTitle: 'Menos copy-paste, menos erros, mais clientes.',
            svcContabItems: [
                'Recolha autom\u00e1tica de faturas',
                'Integra\u00e7\u00e3o com AT e e-Fatura',
                'Alertas de prazos fiscais',
                'Relat\u00f3rios peri\u00f3dicos'
            ],
            svcImobTag: 'Imobili\u00e1rias',
            svcImobTitle: 'Publique em v\u00e1rios portais com um clique.',
            svcImobItems: [
                'Sincroniza\u00e7\u00e3o com Idealista, Imovirtual e outros',
                'Follow-up autom\u00e1tico de leads',
                'Agendamento de visitas integrado',
                'Gera\u00e7\u00e3o de contratos'
            ],
            svcClinicTag: 'Cl\u00ednicas',
            svcClinicTitle: 'Consultas organizadas sem trocas de emails.',
            svcClinicItems: [
                'Lembretes por SMS e WhatsApp',
                'Agendamento online',
                'Fichas digitais de pacientes'
            ],
            svcAutoTag: 'Oficinas Auto',
            svcAutoTitle: 'Chega de fichas em papel e cadernos de marca\u00e7\u00f5es.',
            svcAutoItems: [
                'Fichas digitais por viatura',
                'Lembretes de revis\u00e3o e IPO',
                'Marca\u00e7\u00f5es online'
            ],
            svcOutroTitle: 'Outro setor?',
            svcOutroDesc: 'Se tem tarefas repetitivas, provavelmente conseguimos automatiz\u00e1-las.',
            svcOutroLink: 'Fale connosco \u2192',

            // Process
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

            // Team
            teamLabel: 'Quem somos',
            teamTitle: 'Tecnologia e gest\u00e3o, a trabalhar juntos.',
            teamDesc: 'Somos dois jovens com forma\u00e7\u00e3o em Engenharia Inform\u00e1tica e Gest\u00e3o. Lan\u00e7\u00e1mos a Flowmatic porque vemos todos os dias empresas a perder horas em tarefas que podiam ser resolvidas com tecnologia simples. Sem buzzwords, sem complica\u00e7\u00f5es \u2014 solu\u00e7\u00f5es pr\u00e1ticas que funcionam.',
            memberRBRole: 'Engenharia Inform\u00e1tica',
            memberRBDesc: 'Respons\u00e1vel pela parte t\u00e9cnica \u2014 desenvolvimento, integra\u00e7\u00f5es e automa\u00e7\u00f5es.',
            memberVTRole: 'Gest\u00e3o',
            memberVTDesc: 'Respons\u00e1vel pela an\u00e1lise de processos, rela\u00e7\u00e3o com clientes e estrat\u00e9gia.',

            // Contact
            contactLabel: 'Contacto',
            contactTitle: 'Agende um diagn\u00f3stico gratuito.',
            contactDesc: 'Sem custos, sem compromisso. Reunimos consigo para perceber o seu neg\u00f3cio e mostrar como podemos ajudar. Se fizer sentido, avan\u00e7amos. Se n\u00e3o, fica com ideias \u00fateis na mesma.',
            contactLocation: 'Localiza\u00e7\u00e3o',
            formNome: 'Nome *',
            formEmpresa: 'Empresa',
            formMensagem: 'O que gostaria de automatizar?',
            formBtn: 'Agendar reuni\u00e3o gratuita',
            formNote: 'Respondemos em menos de 24 horas.',

            // Footer
            footer: '\u00a9 2025 Flowmatic'
        },

        en: {
            title: 'Flowmatic \u2014 Process Automation',
            metaDesc: 'We automate repetitive tasks for businesses.',

            // Nav
            navServicos: 'Services',
            navProcesso: 'Process',
            navEquipa: 'Team',
            navCta: 'Book a meeting',

            // Hero
            heroTitle: 'Is your company still wasting<br>hours on tasks that could<br>be <em>automated</em>?',
            heroDesc: 'Invoices sent by hand. Data copied from one system to another. Documents filled out one by one. We eliminate that work \u2014 so your team can focus on what really matters.',
            heroCardTitle: 'Free 30-min assessment',
            heroCardDesc: 'We analyze your processes and show you what can be automated. No cost, no commitment.',
            heroCardBtn: 'Book a meeting',

            // Services
            svcLabel: 'Services',
            svcTitle: 'What we automate',
            svcCondoTag: 'Property Management',
            svcCondoTitle: 'Billing, receipts, meeting minutes and tenant communication \u2014 all on autopilot.',
            svcCondoItems: [
                'Automatic payment reminders',
                'Receipts generated and sent automatically',
                'Meeting minutes from templates',
                'Email and WhatsApp notifications',
                'Dashboard with each property\u2019s status'
            ],
            svcContabTag: 'Accounting',
            svcContabTitle: 'Less copy-paste, fewer errors, more clients.',
            svcContabItems: [
                'Automatic invoice collection',
                'Tax authority integration',
                'Tax deadline alerts',
                'Periodic reports'
            ],
            svcImobTag: 'Real Estate',
            svcImobTitle: 'Publish on multiple portals with one click.',
            svcImobItems: [
                'Sync with Idealista, Imovirtual and others',
                'Automatic lead follow-up',
                'Integrated visit scheduling',
                'Contract generation'
            ],
            svcClinicTag: 'Clinics',
            svcClinicTitle: 'Organized appointments without email chains.',
            svcClinicItems: [
                'SMS and WhatsApp reminders',
                'Online scheduling',
                'Digital patient records'
            ],
            svcAutoTag: 'Auto Repair Shops',
            svcAutoTitle: 'No more paper forms and appointment notebooks.',
            svcAutoItems: [
                'Digital vehicle records',
                'Service and inspection reminders',
                'Online bookings'
            ],
            svcOutroTitle: 'Another industry?',
            svcOutroDesc: 'If you have repetitive tasks, we can probably automate them.',
            svcOutroLink: 'Get in touch \u2192',

            // Process
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

            // Team
            teamLabel: 'About us',
            teamTitle: 'Technology and management, working together.',
            teamDesc: 'We\u2019re two young professionals with backgrounds in Computer Engineering and Management. We started Flowmatic because we see businesses losing hours every day on tasks that could be solved with simple technology. No buzzwords, no complications \u2014 practical solutions that work.',
            memberRBRole: 'Computer Engineering',
            memberRBDesc: 'Responsible for the technical side \u2014 development, integrations and automations.',
            memberVTRole: 'Management',
            memberVTDesc: 'Responsible for process analysis, client relations and strategy.',

            // Contact
            contactLabel: 'Contact',
            contactTitle: 'Book a free assessment.',
            contactDesc: 'No cost, no commitment. We\u2019ll meet with you to understand your business and show how we can help. If it makes sense, we move forward. If not, you still walk away with useful ideas.',
            contactLocation: 'Location',
            formNome: 'Name *',
            formEmpresa: 'Company',
            formMensagem: 'What would you like to automate?',
            formBtn: 'Book a free meeting',
            formNote: 'We respond within 24 hours.',

            // Footer
            footer: '\u00a9 2025 Flowmatic'
        }
    };

    function setLanguage(lang) {
        const t = translations[lang];
        if (!t) return;

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (!(key in t)) return;

            // Handle meta tags with data-i18n-attr
            if (el.dataset.i18nAttr) {
                el.setAttribute(el.dataset.i18nAttr, t[key]);
            } else if (el.tagName === 'TITLE') {
                document.title = t[key];
            } else {
                el.innerHTML = t[key];
            }
        });

        // Update all lists with data-i18n-list
        document.querySelectorAll('[data-i18n-list]').forEach(ul => {
            const key = ul.dataset.i18nList;
            const items = t[key];
            if (!items) return;
            ul.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
        });

        // Update html lang attribute
        document.getElementById('htmlRoot').setAttribute('lang', lang === 'pt' ? 'pt-PT' : 'en');

        // Update toggle button text
        const btn = document.getElementById('langToggle');
        btn.textContent = lang === 'pt' ? 'EN' : 'PT';

        // Save preference
        localStorage.setItem('flowmatic-lang', lang);
    }

    // Language toggle button
    const langToggle = document.getElementById('langToggle');
    langToggle.addEventListener('click', () => {
        const current = localStorage.getItem('flowmatic-lang') || 'pt';
        setLanguage(current === 'pt' ? 'en' : 'pt');
    });

    // Apply saved language on load (only if not PT)
    const savedLang = localStorage.getItem('flowmatic-lang');
    if (savedLang && savedLang !== 'pt') {
        setLanguage(savedLang);
    }
});
