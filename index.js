/* global hexo */
'use strict';

const { join } = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const ejs = require('ejs');
const { Cache } = require('hexo-util');
const utils = require('hexo-cake-utils')(hexo, __dirname);
const injector = require('hexo-extend-injector2')(hexo);
const cache = new Cache();

const urlFor = hexo.extend.helper.get('url_for').bind(hexo);

const fa = (ctx, css) => {
  const { fa_inline } = ctx;
  if (!fa_inline) {
    return `<i class='${css}'></i>`;
  }
  const data = css.split(' ');
  return fa_inline(data[1].substring(3), {prefix: data[0]});
};

utils.loadPlugin('hexo-generator-searchdb');

const defaultLang = {
  'search.menu': 'Search',
  'search.placeholder': 'Searching...'
};
const zh = {
  'search.menu': '搜索',
  'search.placeholder': '搜索...'
};
const langs = {
  'en': defaultLang,
  'zh': zh,
  'zh-CN': zh
};
const getLangData = (ctx, key) => {
  const { __, page } = ctx;
  const temp = __(key);
  if (temp === key) {
    return (langs[page.lang] || defaultLang)[key];
  }
  return temp;
};

// Get config
const defaultConfig = yaml.safeLoad(fs.readFileSync(join(__dirname, 'default.yaml')));
const config = Object.assign(defaultConfig, hexo.config.search);
hexo.config.search = config;

injector.register('menu', {
  value: ctx => {
    return cache.apply(`menu-${ctx.page.lang}`, () => {
      const {theme} = ctx;
      let icon;
      if (theme.menu_settings && theme.menu_settings.icons === false) {
        icon = '';
      } else {
        icon = config.menu.icon ? fa(ctx, config.menu.icon) : '';
      }
      const button = icon + getLangData(ctx, 'search.menu');
      return `<li class="menu-item menu-item-search"><a href="javascript:;" class="popup-trigger">${button}</a></li>`;
    });
  },
  priority: config.menu.priority
});


const template = fs.readFileSync(join(__dirname, 'layout/local-search.ejs')).toString();
injector.register('body-end', ctx => {
  return cache.apply(`script-${ctx.page.lang}`, () => {
    const placeholder = getLangData(ctx, 'search.placeholder');
    return ejs.render(template, {
      placeholder,
      searchIcon: fa(ctx, 'fas fa-search'),
      closeIcon: fa(ctx, 'fas fa-times-circle')
    });
  });
});

injector.register('style', join(__dirname, 'layout/local-search.styl'));
injector.register('js', {
  value: `localsearch = {path: '${urlFor(config.path)}', options: ${JSON.stringify(config.layout)}};`,
  priority: 1
});
injector.register('js', join(__dirname, 'dist/local-search.js'));
