// === МОЙ ULTRA BALANCERS 2026 ===
// Universal Parser + багато онлайн-балансерів

(function () {
    'use strict';
    if (window.__my_ultra_balancers_plugin__) return;
    window.__my_ultra_balancers_plugin__ = true;

    var PLUGIN_NAME = 'Мій Ultra Balancers';
    var PLUGIN_CODE = 'my_ultra_balancers';
    var PLUGIN_VERSION = '1.2';

    var CONFIG = {
        mode: 'direct', // 'direct' — без proxy
        ui: {
            sourceName: 'ultra_balancers'
        },
        balancers: [
            { name: "OnlyModels", base: "https://onlymodels.icu" },
            { name: "Online_Mod", base: "https://nb557.github.io/plugins" },
            { name: "BWA Cloud", base: "https://bwa.to" },
            { name: "Prestige", base: "https://bwa.to/plugins" },
            { name: "Alloha", base: "https://alloha.tv" },
            { name: "Kinobase", base: "https://kinobase.org" },
            { name: "Rezka", base: "https://rezka.ag" },
            { name: "Filmix", base: "https://filmix.my" },
            { name: "Showy Online", base: "http://showy.online" }
        ]
    };

    function log(msg) {
        console.log('%c[' + PLUGIN_CODE + '] ' + msg, 'color:#00ff9d');
    }

    function getCurrentTitle() {
        var act = Lampa.Activity.active ? Lampa.Activity.active() : null;
        if (act && act.object) {
            return act.object.title || act.object.name || act.object.original_title || '';
        }
        return '';
    }

    function searchInBalancers(title) {
        if (!title) {
            title = prompt('Введіть назву фільму/серіалу:');
            if (!title) return;
        }

        Lampa.Noty.show('🔍 Шукаю в Ultra Balancers: ' + title, 5000);

        // Відкриваємо основні балансери з пошуком
        var urls = CONFIG.balancers.map(function(b) {
            return b.base + (b.base.includes('?') ? '&' : '?') + 'search=' + encodeURIComponent(title);
        });

        // Відкриваємо перший (OnlyModels) відразу
        window.open(urls[0], '_blank');

        // Інші — через невелику затримку (щоб не заблокували)
        setTimeout(function() {
            if (confirm('Відкрити ще ' + (CONFIG.balancers.length - 1) + ' балансерів?')) {
                urls.slice(1, 5).forEach(function(url, i) {
                    setTimeout(function() {
                        window.open(url, '_blank');
                    }, i * 800);
                });
            }
        }, 1200);

        log('Пошук запущено для: ' + title);
    }

    // Реєстрація плагіна
    function register() {
        log('Плагін завантажено v' + PLUGIN_VERSION);

        // Додаємо в меню розширень
        if (Lampa.Settings && Lampa.Settings.addSource) {
            Lampa.Settings.addSource({
                name: '🔥 ' + PLUGIN_NAME,
                icon: '🔥',
                onSelect: function() {
                    var title = getCurrentTitle();
                    searchInBalancers(title);
                }
            });
        }

        // Додаємо кнопку в картку фільму
        if (Lampa.Listener) {
            Lampa.Listener.send('card', 'add_button', {
                name: PLUGIN_CODE,
                title: '🔥 Ultra Balancers',
                icon: '🔥',
                onSelect: function() {
                    var title = getCurrentTitle();
                    searchInBalancers(title);
                }
            });
        }

        // Глобальна функція на всяк випадок
        window.openUltraBalancers = searchInBalancers;

        log('Кнопка та пункт меню додані. Відкрий фільм і натисни кнопку 🔥 Ultra Balancers');
    }

    if (window.appready) register();
    else if (Lampa.Listener) {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') register();
        });
    } else {
        setTimeout(register, 3000); // fallback
    }
})();
