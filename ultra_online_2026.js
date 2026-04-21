// ====================== ULTRA ONLINE OPEN 2026 ======================
// Найпростіший робочий варіант — відкриває OnlyModels при натисканні на фільм

(function() {
    'use strict';

    console.log('%c✅ Ultra Online Open 2026 завантажено! Просто відкрий будь-який фільм.', 'color:#00ff9d; font-size:16px; font-weight:bold');

    // Основна функція
    function openOnline() {
        // Беремо назву поточного фільму/серіалу
        let activity = Lampa.Activity.active ? Lampa.Activity.active() : null;
        let title = '';

        if (activity && activity.object) {
            title = activity.object.title || activity.object.name || activity.object.original_title || '';
        }

        if (!title) {
            // Якщо не вдалося взяти з activity — просимо ввести вручну
            title = prompt('Введи назву фільму/серіалу для пошуку в OnlyModels:');
            if (!title) return;
        }

        Lampa.Noty.show(`🔍 Відкриваю "${title}" в OnlyModels...`);

        // Відкриваємо OnlyModels з пошуком
        const url = `https://onlymodels.icu/p?search=${encodeURIComponent(title)}`;
        window.open(url, '_blank');

        // Додатково пропонуємо Online_Mod
        setTimeout(() => {
            if (confirm('Відкрити також Online_Mod для більшої кількості джерел?')) {
                window.open(`https://nb557.github.io/plugins/online_mod.js?search=${encodeURIComponent(title)}`, '_blank');
            }
        }, 1800);
    }

    // Спроба додати кнопку в меню (якщо спрацює)
    if (Lampa && Lampa.Settings && Lampa.Settings.addSource) {
        Lampa.Settings.addSource({
            name: '🔥 Ultra Online Open',
            icon: '🔥',
            onSelect: openOnline
        });
    }

    // Головний спосіб — додаємо пункт у контекстне меню (більш стабільно)
    Lampa.Listener.send('app', 'add_menu_item', {
        name: 'ultra_online',
        title: '🔥 Ultra Online',
        onSelect: openOnline
    });

    console.log('Плагін готовий. Відкрий будь-який фільм → натисни на три крапки або меню → шукай "Ultra Online"');
})();
