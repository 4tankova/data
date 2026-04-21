// === МОЙ ULTRA ONLINE 2026 (під 4tankova.github.io) ===

(function () {
    'use strict';
    if (window.__my_ultra_online_2026__) return;
    window.__my_ultra_online_2026__ = true;

    var PLUGIN_NAME = 'Ultra Online 2026';
    var PLUGIN_CODE = 'ultra_online_2026';

    console.log('%c🔥 Ultra Online 2026 (4tankova) завантажено!', 'color:#00ff9d; font-size:16px; font-weight:bold');

    function getTitle() {
        var act = Lampa.Activity && Lampa.Activity.active ? Lampa.Activity.active() : null;
        if (act && act.object) {
            return act.object.title || act.object.name || act.object.original_title || '';
        }
        return '';
    }

    function openUltra2026() {
        var title = getTitle();

        if (!title) {
            title = prompt('Введіть назву фільму / серіалу:');
            if (!title) return;
        }

        Lampa.Noty.show(`🔍 Ultra Online 2026: ${title}`, 5000);

        // Завантажуємо твій основний файл
        window.open('https://4tankova.github.io/data/ultra_online_2026.js?search=' + encodeURIComponent(title), '_blank');

        // Додатково відкриваємо OnlyModels напряму
        setTimeout(() => {
            window.open('https://onlymodels.icu/p?search=' + encodeURIComponent(title), '_blank');
        }, 700);

        setTimeout(() => {
            window.open('https://onlymodels.icu/lite/withsearch?search=' + encodeURIComponent(title), '_blank');
        }, 1400);

        // Завантажуємо nws-client
        if (!document.getElementById('nws-client-ultra')) {
            var s = document.createElement('script');
            s.id = 'nws-client-ultra';
            s.src = 'https://onlymodels.icu/js/nws-client-es5.js?v18112025';
            document.head.appendChild(s);
        }
    }

    // Додаємо кнопку в картку фільму
    if (Lampa && Lampa.Listener) {
        Lampa.Listener.send('card', 'add_button', {
            name: PLUGIN_CODE,
            title: '🔥 Ultra Online 2026',
            icon: '🔥',
            onSelect: openUltra2026
        });
    }

    // Додаємо в меню розширень
    if (Lampa && Lampa.Settings && Lampa.Settings.addSource) {
        Lampa.Settings.addSource({
            name: '🔥 Ultra Online 2026',
            icon: '🔥',
            onSelect: openUltra2026
        });
    }

    window.openUltraOnline2026 = openUltra2026;

    console.log('✅ Плагін готовий. Відкрий фільм — має з’явитися кнопка "Ultra Online 2026"');
})();
