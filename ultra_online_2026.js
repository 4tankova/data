// ====================== ULTRA ONLINE SIMPLE 2026 ======================
// Найпростіша робоча версія — просто відкриває OnlyModels + Online_Mod

(function() {
    'use strict';

    console.log('%c✅ Ultra Online Simple 2026 завантажено!', 'color:#00ff9d; font-size:16px; font-weight:bold');

    // Головна функція — шукати онлайн
    function openUltraOnline() {
        const card = Lampa.Activity.active();
        let title = '';

        if (card && card.object) {
            title = card.object.title || card.object.name || '';
        }

        if (!title) {
            Lampa.Noty.show('Не вдалося визначити назву фільму 😕');
            return;
        }

        Lampa.Noty.show(`🔍 Шукаємо "${title}" в Ultra Online...`);

        // Відкриваємо OnlyModels з пошуком
        const searchUrl = `https://onlymodels.icu/p?search=${encodeURIComponent(title)}`;
        window.open(searchUrl, '_blank');

        // Через 1 секунду пропонуємо Online_Mod
        setTimeout(() => {
            if (confirm('Хочеш також відкрити Online_Mod?')) {
                window.open(`https://nb557.github.io/plugins/online_mod.js?search=${encodeURIComponent(title)}`, '_blank');
            }
        }, 1200);
    }

    // Додаємо кнопку в картку фільму (найнадійніший спосіб)
    Lampa.Listener.send('card', 'add_button', {
        name: 'ultra_online_btn',
        title: '🔥 Ultra Online',
        icon: '🔥',
        onSelect: openUltraOnline
    });

    // Також додаємо в меню розширень
    if (Lampa.Settings && Lampa.Settings.addSource) {
        Lampa.Settings.addSource({
            name: 'Ultra Online Simple',
            icon: '🔥',
            onSelect: openUltraOnline
        });
    }

    console.log('Кнопка "Ultra Online" додана — відкривай будь-який фільм і шукай кнопку!');
})();
