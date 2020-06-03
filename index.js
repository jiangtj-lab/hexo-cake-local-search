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
  let { fa_inline } = ctx;
  if (!fa_inline) {
    return `<i class='${css}'></i>`
  }
  let data = css.split(' ');
  return fa_inline(data[1].substring(3), {prefix: data[0]});
}

utils.loadPlugin('hexo-generator-searchdb');

let defaultLang = {
  "search.menu": "Search",
  "search.placeholder": "Searching..."
}
let zh = {
  "search.menu": "搜索",
  "search.placeholder": "搜索..."
}
utils.i18n({
  "default": defaultLang,
  "en": defaultLang,
  "zh": zh,
  "zh-CN": zh
})

// Get config
let defaultConfig = yaml.safeLoad(fs.readFileSync(join(__dirname, 'default.yaml')));
var config = hexo.config.search = Object.assign(defaultConfig, hexo.config.search);

injector.register('menu', {
  value: ctx => {
    return cache.apply(`menu-${ctx.page.lang}`, () => {
      let {__, theme} = ctx;
      let icon;
      if (theme.menu_settings && theme.menu_settings.icons === false) {
        icon = '';
      } else {
        icon = config.menu.icon ? fa(ctx, config.menu.icon) : '';
      }
      let button = icon + __('search.menu');
      return `<li class="menu-item menu-item-search"><a href="javascript:;" class="popup-trigger">${button}</a></li>`
    })
  },
  priority: config.menu.priority
})


let template = fs.readFileSync(join(__dirname, 'layout/local-search.ejs')).toString();
injector.register('body-end', ctx => {
  return cache.apply(`script-${ctx.page.lang}`, () => {
    let placeholder = ctx.__('search.placeholder');
    return ejs.render(template, {
      placeholder,
      searchIcon: fa(ctx, 'fas fa-search'),
      closeIcon: fa(ctx, 'fas fa-times-circle')
    });
  })
})

injector.register('style', join(__dirname, 'layout/local-search.styl'));
injector.register('js', `localsearch = {path: '${urlFor(config.path)}', options: ${JSON.stringify(config.layout)}};`);
injector.register('js', join(__dirname, 'dist/local-search.js'));
