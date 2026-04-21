// === МОЙ ULTRA ONLINE PLUGIN 2026 ===
// Назва: Мій Ultra Online

(function() {
    'use strict';

    console.log('%c🔥 Мій Ultra Online плагін завантажено!', 'color:#00ff9d; font-size:16px; font-weight:bold');

    function openMyOnline() {
        // Беремо назву поточного фільму
        let title = '';
        const activity = Lampa.Activity.active ? Lampa.Activity.active() : null;
        
        if (activity && activity.object) {
            title = activity.object.title || activity.object.name || activity.object.original_title || '';
        }

        if (!title) {
            title = prompt('Введіть назву фільму/серіалу для пошуку:');
            if (!title) return;
        }

        Lampa.Noty.show(`🔍 Відкриваю "${title}" у OnlyModels...`);

        // Основне — OnlyModels (твій плагін)
        const onlymodelsUrl = `https://onlymodels.icu/p?search=${encodeURIComponent(title)}`;
        window.open(onlymodelsUrl, '_blank');

        // Додатково — Online_Mod через 1.5 секунди
        setTimeout(() => {
            if (confirm('Відкрити також Online_Mod для більше джерел?')) {
                window.open(`https://nb557.github.io/plugins/online_mod.js?search=${encodeURIComponent(title)}`, '_blank');
            }
        }, 1500);
    }

    // Додаємо кнопку в картку фільму (найстабільніший спосіб)
    if (Lampa && Lampa.Listener) {
        Lampa.Listener.send('card', 'add_button', {
            name: 'my_ultra_online',
            title: '🔥 Мій Ultra Online',
            icon: '🔥',
            onSelect: openMyOnline
        });
    }

    // Також додаємо пункт у меню розширень
    if (Lampa && Lampa.Settings && Lampa.Settings.addSource) {
        Lampa.Settings.addSource({
            name: '🔥 Мій Ultra Online',
            icon: '🔥',
            onSelect: openMyOnline
        });
    }

    console.log('✅ Кнопка "Мій Ultra Online" повинна з’явитися при відкритті фільму');
})();
