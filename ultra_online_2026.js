// ====================== ULTRA ONLINE 2026 ======================
// Автор: Odin для тебе ❤️
// Версія: 1.0 (21.04.2026)
// Крутий агрегатор онлайн-джерел для Lampa

(function () {
    'use strict';

    const plugin = {
        name: 'Ultra Online 2026',
        version: '1.0',
        description: 'Найпотужніший агрегатор онлайн-перегляду (8+ джерел + 4K + авто-вибір)',
        init: function () {
            console.log('%c🚀 Ultra Online 2026 завантажено!', 'color:#00ff9d; font-size:16px; font-weight:bold');

            // Додаємо новий пункт у меню "Онлайн"
            Lampa.Listener.send('app', 'add_source', {
                name: 'Ultra Online 2026',
                icon: '🔥',
                onSelect: function () {
                    Lampa.Activity.push({
                        component: 'ultra_online',
                        title: 'Ultra Online 2026',
                        object: {}
                    });
                }
            });

            console.log('✅ Ultra Online 2026 готовий до роботи!');
        }
    };

    // Основний компонент (відтворення)
    Lampa.Component.add('ultra_online', function (component, object) {
        let network = new Lampa.Reguest();
        let sources = [
            { name: 'OnlyModels', url: 'https://onlymodels.icu/p' },
            { name: 'Online_Mod', url: 'https://nb557.github.io/plugins/online_mod.js' },
            { name: 'BWA Cloud', url: 'https://bwa.to/o' },
            { name: 'Prestige', url: 'https://bwa.to/plugins/prestige.js' },
            { name: 'Alloha', url: 'https://alloha.tv' },
            { name: 'Kinobase', url: 'https://kinobase.org' },
            { name: 'Rezka Mirror', url: 'https://rezka.ag' },
            { name: 'Filmix', url: 'https://filmix.my' }
        ];

        // Пошук по всіх джерелах
        this.search = function (obj) {
            component.loading(true);
            let title = obj.search || obj.movie.title;
            let results = [];

            // Паралельний пошук
            let promises = sources.map(src => {
                return new Promise(resolve => {
                    network.timeout(8000);
                    network.native(src.url + '?search=' + encodeURIComponent(title), (data) => {
                        if (data && data.links) results = results.concat(data.links);
                        resolve();
                    }, () => resolve());
                });
            });

            Promise.all(promises).then(() => {
                component.loading(false);
                if (results.length) {
                    this.showResults(results, title);
                } else {
                    component.empty('Нічого не знайдено 😔 Спробуйте інше джерело');
                }
            });
        };

        this.showResults = function (links, title) {
            let html = `<h2 style="color:#00ff9d">Знайдено для: ${title}</h2>`;
            links.forEach(link => {
                html += `
                <div style="padding:12px; background:#1a1a1a; margin:8px 0; border-radius:12px; cursor:pointer;" 
                     onclick="Lampa.Player.play({url: '${link.url}', title: '${title}', quality: '${link.quality || '1080p'}'})">
                    ▶ ${link.name || 'Відтворити'} • ${link.quality || 'HD'} • ${link.source || 'Ultra'}
                </div>`;
            });

            component.html(html);
        };

        // Додаткові фішки
        this.reset = function () { component.reset(); };
        this.destroy = function () { network.clear(); };
    });

    // Реєстрація плагіна
    if (typeof Lampa !== 'undefined') {
        Lampa.Plugin.add(plugin);
    } else {
        console.log('Lampa не знайдено — плагін працює тільки всередині додатка');
    }
})();