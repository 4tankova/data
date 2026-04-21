// ====================== ULTRA ONLINE 2026 FIX ======================
// Спрощена та стабільна версія для Lampa 2026

(function() {
    'use strict';

    const plugin = {
        name: "Ultra Online 2026",
        version: "1.1-fix",
        description: "Потужний агрегатор онлайн-джерел (OnlyModels + інші)",
        
        init: function() {
            console.log('%c✅ Ultra Online 2026 FIX завантажено успішно!', 'color:#00ff9d; font-size:15px;');

            // Додаємо джерело в меню "Онлайн"
            if (Lampa && Lampa.Settings && Lampa.Settings.addSource) {
                Lampa.Settings.addSource({
                    name: 'Ultra Online 2026',
                    icon: '🔥',
                    onSelect: function() {
                        Lampa.Activity.push({
                            component: 'ultra_online_activity',
                            title: 'Ultra Online 2026',
                            object: {}
                        });
                    }
                });
            }

            // Додаємо кнопку "Ultra Online" при перегляді фільму
            Lampa.Listener.send('app', 'add_button', {
                name: 'ultra_online',
                title: '▶ Ultra Online',
                icon: '🔥',
                onSelect: function(movie) {
                    if (movie && movie.title) {
                        searchInUltraOnline(movie.title);
                    } else {
                        Lampa.Noty.show('Не вдалося отримати назву фільму');
                    }
                }
            });
        }
    };

    // Функція пошуку
    function searchInUltraOnline(title) {
        Lampa.Noty.show('🔍 Шукаємо "' + title + '" у Ultra Online...');

        // Основні джерела
        const sources = [
            'https://onlymodels.icu/p?search=' + encodeURIComponent(title),
            'https://nb557.github.io/plugins/online_mod.js?search=' + encodeURIComponent(title)
        ];

        // Відкриваємо перше джерело (можна розширити)
        window.open(sources[0], '_blank');

        // Повідомлення користувачу
        setTimeout(() => {
            Lampa.Noty.show('✅ Відкрито OnlyModels. Якщо потрібно більше джерел — додай Online_Mod окремо.');
        }, 1500);
    }

    // Реєстрація плагіна (правильний спосіб для більшості версій Lampa)
    if (typeof Lampa !== 'undefined' && Lampa.Plugin) {
        Lampa.Plugin.add(plugin);
    } else if (typeof window !== 'undefined') {
        window.UltraOnlinePlugin = plugin;
        console.log('Плагін готовий. Додай його в Lampa і перезапусти додаток.');
    }
})();
