(function () {
    'use strict';

    if (window.__custom_universal_parser_plugin__) return;
    window.__custom_universal_parser_plugin__ = true;

    var PLUGIN_NAME = 'Universal Parser';
    var PLUGIN_CODE = 'universal_parser_onefile';
    var PLUGIN_VERSION = '1.0.0';

    /**
     * =========================
     * CONFIG
     * =========================
     *
     * MODE:
     *  - 'proxy': плагін бере JSON з твого API
     *  - 'direct': плагін напряму тягне HTML і парсить його в браузері
     *
     * Для реального використання майже завжди краще 'proxy'
     * бо direct часто впирається в CORS.
     */
    var CONFIG = {
        mode: 'proxy', // 'proxy' | 'direct'

        proxy: {
            url: 'http://localhost:3000'
        },

        direct: {
            base: 'https://example.com',
            routes: {
                main: function (page) {
                    return 'https://example.com/catalog?page=' + page;
                },
                search: function (query, page) {
                    return 'https://example.com/search?q=' + encodeURIComponent(query) + '&page=' + page;
                },
                item: function (url) {
                    return url;
                }
            },
            selectors: {
                card: '.card',
                title: '.card__title',
                link: 'a',
                poster: 'img',
                description: '.card__desc'
            },
            detail: {
                title: 'h1',
                description: '.description',
                poster: '.poster img',
                video: 'video source, video, iframe, .player source, .player iframe'
            }
        },

        ui: {
            component: 'universal_parser_component',
            sourceName: 'custom_universal'
        }
    };

    function log() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[' + PLUGIN_CODE + ']');
        console.log.apply(console, args);
    }

    function safeText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function abs(base, value) {
        if (!value) return '';
        try {
            return new URL(value, base).toString();
        } catch (e) {
            return value || '';
        }
    }

    function uid(str) {
        return safeText(str || '')
            .toLowerCase()
            .replace(/[^\w\u0400-\u04FF]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 120) || ('id_' + Math.random().toString(36).slice(2, 10));
    }

    function getAttr(el, attrs) {
        for (var i = 0; i < attrs.length; i++) {
            var val = el.getAttribute(attrs[i]);
            if (val) return val;
        }
        return '';
    }

    function requestText(url) {
        return fetch(url, {
            method: 'GET',
            credentials: 'omit'
        }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
            return res.text();
        });
    }

    function requestJson(url) {
        return fetch(url, {
            method: 'GET',
            credentials: 'omit'
        }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
            return res.json();
        });
    }

    function parseHTML(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    function qs(root, selector) {
        try {
            return root.querySelector(selector);
        } catch (e) {
            return null;
        }
    }

    function qsa(root, selector) {
        try {
            return Array.prototype.slice.call(root.querySelectorAll(selector));
        } catch (e) {
            return [];
        }
    }

    function cardToItem(node, pageUrl) {
        var sel = CONFIG.direct.selectors;

        var titleNode = sel.title ? qs(node, sel.title) : null;
        var linkNode = sel.link ? qs(node, sel.link) : null;
        var posterNode = sel.poster ? qs(node, sel.poster) : null;
        var descNode = sel.description ? qs(node, sel.description) : null;

        var title = safeText(titleNode ? titleNode.textContent : '');
        var link = abs(pageUrl, linkNode ? getAttr(linkNode, ['href']) : '');
        var poster = abs(pageUrl, posterNode ? getAttr(posterNode, ['src', 'data-src', 'data-original', 'data-lazy']) : '');
        var description = safeText(descNode ? descNode.textContent : '');

        if (!title && !link && !poster) return null;

        return {
            id: uid(link || title),
            title: title || 'Без назви',
            name: title || 'Без назви',
            original_title: title || 'Без назви',
            overview: description || '',
            poster_path: poster || '',
            backdrop_path: poster || '',
            custom: {
                url: link || '',
                source: CONFIG.ui.sourceName
            }
        };
    }

    function parseCatalogDirect(html, pageUrl) {
        var doc = parseHTML(html);
        var sel = CONFIG.direct.selectors;
        var cards = qsa(doc, sel.card);
        var map = {};
        var results = [];

        cards.forEach(function (node) {
            var item = cardToItem(node, pageUrl);
            if (!item) return;

            var key = item.custom.url || (item.title + '|' + item.poster_path);
            if (map[key]) return;
            map[key] = true;

            results.push(item);
        });

        return {
            page: 1,
            total_pages: 2,
            total_results: results.length,
            results: results
        };
    }

    function parseItemDirect(html, pageUrl) {
        var doc = parseHTML(html);
        var det = CONFIG.direct.detail;

        var titleNode = det.title ? qs(doc, det.title) : null;
        var descNode = det.description ? qs(doc, det.description) : null;
        var posterNode = det.poster ? qs(doc, det.poster) : null;
        var videoNode = det.video ? qs(doc, det.video) : null;

        var title = safeText(titleNode ? titleNode.textContent : '');
        var overview = safeText(descNode ? descNode.textContent : '');
        var poster = abs(pageUrl, posterNode ? getAttr(posterNode, ['src', 'data-src', 'data-original']) : '');

        var video = '';
        if (videoNode) {
            var tag = (videoNode.tagName || '').toLowerCase();
            if (tag === 'iframe') video = getAttr(videoNode, ['src']);
            else if (tag === 'video' || tag === 'source') video = getAttr(videoNode, ['src']);
            else video = getAttr(videoNode, ['src', 'href', 'data-src']);
        }

        return {
            id: uid(pageUrl || title),
            title: title || 'Без назви',
            name: title || 'Без назви',
            original_title: title || 'Без назви',
            overview: overview || '',
            poster_path: abs(pageUrl, poster),
            backdrop_path: abs(pageUrl, poster),
            url: pageUrl,
            video_url: abs(pageUrl, video),
            custom: {
                url: pageUrl,
                source: CONFIG.ui.sourceName
            }
        };
    }

    function loadCatalog(params) {
        var page = params.page || 1;
        var query = safeText(params.query);

        if (CONFIG.mode === 'proxy') {
            if (query) {
                return requestJson(
                    CONFIG.proxy.url + '/catalog/search?q=' + encodeURIComponent(query) + '&page=' + page
                );
            }

            return requestJson(
                CONFIG.proxy.url + '/catalog/latest?page=' + page
            );
        }

        var url = query
            ? CONFIG.direct.routes.search(query, page)
            : CONFIG.direct.routes.main(page);

        return requestText(url).then(function (html) {
            var parsed = parseCatalogDirect(html, url);
            parsed.page = page;
            return parsed;
        });
    }

    function loadItem(url) {
        if (!url) return Promise.reject(new Error('Missing item url'));

        if (CONFIG.mode === 'proxy') {
            return requestJson(
                CONFIG.proxy.url + '/catalog/item?url=' + encodeURIComponent(url)
            );
        }

        return requestText(CONFIG.direct.routes.item(url)).then(function (html) {
            return parseItemDirect(html, url);
        });
    }

    function normalizeList(data) {
        var list = (data && data.results) ? data.results : [];
        return list.map(function (item, index) {
            return {
                id: item.id || ('item_' + index),
                title: item.title || item.name || 'Без назви',
                name: item.name || item.title || 'Без назви',
                original_title: item.original_title || item.title || item.name || 'Без назви',
                overview: item.overview || '',
                poster: item.poster || item.poster_path || '',
                poster_path: item.poster_path || item.poster || '',
                backdrop_path: item.backdrop_path || item.poster_path || item.poster || '',
                custom: item.custom || {},
                source: item.source || CONFIG.ui.sourceName
            };
        });
    }

    function toLampaCard(item) {
        return {
            id: item.id,
            title: item.title,
            name: item.name,
            original_title: item.original_title,
            overview: item.overview,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            img: item.poster_path,
            poster: item.poster_path,
            card_class: 'full',
            custom: item.custom || {}
        };
    }

    function openItem(item) {
        var url = item && item.custom ? item.custom.url : '';

        if (!url) {
            Lampa.Noty.show('Немає URL для відкриття');
            return;
        }

        loadItem(url)
            .then(function (data) {
                var video = data.video_url || '';
                var title = data.title || item.title || 'Без назви';

                if (video) {
                    if (Lampa.Player && Lampa.Player.play) {
                        Lampa.Player.play({
                            title: title,
                            url: video
                        });
                        return;
                    }

                    if (Lampa.Utils && Lampa.Utils.copyText) {
                        Lampa.Utils.copyText(video, function () {
                            Lampa.Noty.show('video_url скопійовано');
                        });
                        return;
                    }

                    Lampa.Noty.show('Знайдено video_url, але плеєр недоступний');
                } else {
                    Lampa.Noty.show('На сторінці не знайдено video_url');
                }
            })
            .catch(function (err) {
                console.error(err);
                Lampa.Noty.show('Помилка відкриття картки');
            });
    }

    function renderCatalog(component, params) {
        params = params || {};
        component.loading(true);

        loadCatalog({
            page: params.page || 1,
            query: params.query || ''
        })
            .then(function (data) {
                var list = normalizeList(data).map(toLampaCard);

                component.loading(false);

                if (!list.length) {
                    Lampa.Noty.show('Порожній каталог');
                }

                if (component.create) {
                    component.create(list);
                }

                if (component.listener && component.listener.follow) {
                    component.listener.follow('open', function (e) {
                        if (e && e.data) openItem(e.data);
                    });
                }
            })
            .catch(function (err) {
                console.error(err);
                component.loading(false);
                Lampa.Noty.show('Помилка завантаження каталогу');
            });
    }

    function search(query, callback) {
        loadCatalog({
            page: 1,
            query: query || ''
        })
            .then(function (data) {
                callback(normalizeList(data).map(toLampaCard));
            })
            .catch(function (err) {
                console.error(err);
                callback([]);
            });
    }

    function registerSearch() {
        if (Lampa.Search && Lampa.Search.add) {
            Lampa.Search.add(PLUGIN_CODE, function (query, callback) {
                search(query, callback);
            });
            log('search registered');
        }
    }

    function registerComponent() {
        if (Lampa.Component && Lampa.Component.add) {
            Lampa.Component.add(CONFIG.ui.component, {
                init: function () {},
                create: function () {},
                render: function (component) {
                    renderCatalog(component, { page: 1 });
                }
            });
            log('component registered');
        }
    }

    function registerButton() {
        /**
         * У різних збірках Lampa API меню може відрізнятись.
         * Нижче максимально простий варіант:
         * якщо є Menu.add, додаємо кнопку.
         */
        if (Lampa.Menu && Lampa.Menu.add) {
            Lampa.Menu.add({
                title: PLUGIN_NAME,
                component: CONFIG.ui.component,
                onRender: function (item) {
                    item.css('display', 'block');
                }
            });
            log('menu button registered');
        }
    }

    function registerSettings() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent) return;

        Lampa.SettingsApi.addComponent({
            component: PLUGIN_CODE,
            name: PLUGIN_NAME,
            icon: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: PLUGIN_CODE,
            param: {
                name: 'mode',
                type: 'select',
                values: [
                    { value: 'proxy', title: 'Proxy API' },
                    { value: 'direct', title: 'Direct HTML' }
                ],
                default: CONFIG.mode
            },
            field: {
                name: 'Mode'
            },
            onChange: function (value) {
                CONFIG.mode = value;
                Lampa.Storage.set(PLUGIN_CODE + '_mode', value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: PLUGIN_CODE,
            param: {
                name: 'proxy_url',
                type: 'input',
                default: CONFIG.proxy.url
            },
            field: {
                name: 'Proxy URL'
            },
            onChange: function (value) {
                CONFIG.proxy.url = value;
                Lampa.Storage.set(PLUGIN_CODE + '_proxy_url', value);
            }
        });

        log('settings registered');
    }

    function restoreSettings() {
        var savedMode = Lampa.Storage.get(PLUGIN_CODE + '_mode', CONFIG.mode);
        var savedProxy = Lampa.Storage.get(PLUGIN_CODE + '_proxy_url', CONFIG.proxy.url);

        CONFIG.mode = savedMode || CONFIG.mode;
        CONFIG.proxy.url = savedProxy || CONFIG.proxy.url;
    }

    function start() {
        restoreSettings();
        registerComponent();
        registerSearch();
        registerButton();
        registerSettings();
        log('started', { mode: CONFIG.mode, proxy: CONFIG.proxy.url });
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') start();
    });
})();
