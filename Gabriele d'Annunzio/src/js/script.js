/**
 * script.js
 * Gestione della navigazione per il progetto "Gabriele d'Annunzio"
 */

document.addEventListener('DOMContentLoaded', () => {
    const THEME_KEY = 'theme';
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.setAttribute(
                'aria-pressed',
                theme === 'dark' ? 'true' : 'false'
            );
            themeToggle.textContent = theme === 'dark' ? 'Tema chiaro' : 'Tema scuro';
        }
    };

    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
        applyTheme(storedTheme);
    } else if (window.matchMedia) {
        applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
        applyTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || 'light';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem(THEME_KEY, nextTheme);
        });
    }

    const scrollButtons = document.querySelectorAll('[data-scroll-target]');
    scrollButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetSelector = button.getAttribute('data-scroll-target');
            const target = document.querySelector(targetSelector);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const filters = document.querySelectorAll('.timeline-filter');
    const items = document.querySelectorAll('.timeline-item');
    if (filters.length && items.length) {
        filters.forEach((filter) => {
            filter.addEventListener('click', () => {
                filters.forEach((btn) => btn.classList.remove('is-active'));
                filter.classList.add('is-active');

                const era = filter.getAttribute('data-era');
                items.forEach((item) => {
                    const matches = era === 'all' || item.getAttribute('data-era') === era;
                    item.classList.toggle('is-hidden', !matches);
                });
            });
        });
    }

    const factButton = document.getElementById('fact-btn');
    const factText = document.getElementById('fact-text');
    if (factButton && factText) {
        const factsByGroup = {
            contesto: [
                "Nel primo Novecento l'Italia e' tra i Paesi europei con la piu' forte emigrazione.",
                "D'Annunzio fu tra i principali sostenitori dell'intervento italiano nella Grande Guerra.",
                "La Carta del Carnaro prevedeva un ruolo centrale della musica nella vita pubblica.",
                "Durante la Belle Epoque si diffondono cinema, manifesti pubblicitari e nuove mode urbane.",
                "Molte donne lavorarono nelle fabbriche durante la guerra, cambiando il ruolo sociale femminile."
            ],
            biografia: [
                "D'Annunzio nasce a Pescara nel 1863 e si trasferisce a Roma nel 1881.",
                "Il piacere, pubblicato nel 1889, e' uno dei romanzi piu' celebri del Decadentismo italiano.",
                "Nel 1918 compie il celebre volo su Vienna durante la Prima Guerra Mondiale.",
                "Tra il 1919 e il 1920 guida l'occupazione di Fiume.",
                "Il Vittoriale degli Italiani conserva oggetti, scritti e memoria pubblica dell'autore.",
                "Alcyone e' considerata una delle raccolte poetiche piu' importanti del Novecento italiano.",
                "D'Annunzio lavoro' anche come giornalista, costruendo con cura la propria immagine pubblica.",
                "La sua scrittura unisce lessico ricercato, ritmo musicale e forte impatto retorico."
            ],
            carta: [
                "La Carta del Carnaro viene redatta nel 1920 da Alceste De Ambris e rielaborata da d'Annunzio.",
                "Nel testo il lavoro e' indicato come fondamento della vita dello Stato.",
                "L'ordinamento prevede una rappresentanza per corporazioni, articolata in 9+1 sezioni.",
                "La musica e' descritta come elemento civile centrale nella vita della comunita'.",
                "L'esperienza di Fiume si conclude nel dicembre 1920 con il cosiddetto Natale di sangue."
            ],
            donne: [
                "Nel 1945 le donne italiane ottengono il diritto di voto politico.",
                "Nel 1946 oltre 12 milioni di donne partecipano al referendum istituzionale.",
                "L'articolo 3 della Costituzione afferma l'uguaglianza senza distinzione di sesso.",
                "La riforma del diritto di famiglia del 1975 rafforza la parita' tra coniugi.",
                "La tutela della maternita' nel lavoro nasce da lotte sociali lunghe decenni."
            ]
        };
        const selectedGroup = factButton.dataset.factGroup || 'contesto';
        const facts = factsByGroup[selectedGroup] || factsByGroup.contesto;
        let lastIndex = -1;

        const setRandomFact = () => {
            let nextIndex = Math.floor(Math.random() * facts.length);
            if (facts.length > 1) {
                while (nextIndex === lastIndex) {
                    nextIndex = Math.floor(Math.random() * facts.length);
                }
            }
            lastIndex = nextIndex;
            factText.textContent = facts[nextIndex];
        };

        factButton.addEventListener('click', setRandomFact);
        setRandomFact();
    }

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealElements.forEach((element) => observer.observe(element));
        } else {
            revealElements.forEach((element) => element.classList.add('is-visible'));
        }
    }

    const homeRandomButton = document.getElementById('home-random-btn');
    const homeRandomText = document.getElementById('home-random-text');
    if (homeRandomButton && homeRandomText) {
        const homeRoutes = [
            { title: 'Biografia', href: 'biografia.html', why: 'per capire chi e\' d\'Annunzio prima del contesto storico.' },
            { title: 'Contesto storico', href: 'contesto.html', why: 'per leggere il periodo che rende possibili le sue scelte.' },
            { title: 'Carta del Carnaro', href: 'carta.html', why: 'per esplorare il laboratorio politico di Fiume.' },
            { title: 'Diritti della donna', href: 'donne.html', why: 'per collegare storia e cittadinanza nel presente.' }
        ];
        let lastRouteIndex = -1;

        homeRandomButton.addEventListener('click', () => {
            let nextIndex = Math.floor(Math.random() * homeRoutes.length);
            if (homeRoutes.length > 1) {
                while (nextIndex === lastRouteIndex) {
                    nextIndex = Math.floor(Math.random() * homeRoutes.length);
                }
            }
            lastRouteIndex = nextIndex;
            const route = homeRoutes[nextIndex];
            homeRandomText.innerHTML = `Ti consiglio <strong>${route.title}</strong>, ${route.why} <a href="${route.href}">Apri subito</a>.`;
        });
    }

    const homeFocusText = document.getElementById('home-focus-text');
    if (homeFocusText) {
        const focusMessages = [
            'La biografia aiuta a leggere la strategia comunicativa dell\'autore.',
            'Il contesto storico spiega perche\' il primo dopoguerra e\' cosi\' instabile.',
            'La Carta del Carnaro mostra un mix originale tra politica e immaginazione.',
            'I diritti della donna sono la chiave piu\' attuale di questo percorso.'
        ];
        let focusIndex = 0;

        const setFocusMessage = () => {
            homeFocusText.textContent = focusMessages[focusIndex];
            focusIndex = (focusIndex + 1) % focusMessages.length;
        };

        setFocusMessage();
        setInterval(setFocusMessage, 4500);
    }

    // Definizione della mappatura ID bottone -> Pagina di destinazione
    const navigationMap = {
        'btn-link-bio': 'biografia.html',
        'btn-link-cont': 'contesto.html',
        'btn-link-cart': 'carta.html',
        'btn-link-dir': 'donne.html'
    };

    // Funzione principale per inizializzare i listener
    const initializeNavigation = () => {
        Object.entries(navigationMap).forEach(([buttonId, targetPage]) => {
            const button = document.getElementById(buttonId);
            
            if (button) {
                button.addEventListener('click', (event) => {
                    // Evitiamo comportamenti di default se presenti
                    event.preventDefault();
                    
                    console.log(`Navigazione verso: ${targetPage}`);
                    
                    // Eseguiamo il reindirizzamento
                    window.location.href = targetPage;
                });
            }
        });
    };

    // Esecuzione
    initializeNavigation();
});
