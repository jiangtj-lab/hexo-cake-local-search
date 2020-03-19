const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const ejs = require('ejs');
const {Cache} = require('hexo-util');
const utils = require('hexo-cake-utils')(hexo, __dirname);
const injector = require('hexo-extend-injector2')(hexo);
const cache = new Cache();

hexo.extend.filter.register('after_init', () => {

const faInline = hexo.extend.helper.get('fa_inline');
const fa = css => {
  if (!faInline) {
    return `<i class='${css}'></i>`
  }
  let data = css.split(' ');
  return faInline(data[1].substring(3), {prefix: data[0]});
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
let defaultConfig = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'default.yaml')));
var config = hexo.config.search = Object.assign(defaultConfig, hexo.config.search);

// Generator js
if (config.script.type === 'dist') {
  let jsPath = config.script.path;
  hexo.extend.generator.register('generatorLSJs', () => {
    return {
      path: jsPath,
      data: () => fs.createReadStream(path.join(__dirname, 'dist/local-search.js'))
    }
  });
  config.script.path = path.join(hexo.config.root, jsPath);
}

injector.register('menu', ctx => {
  return cache.apply(`menu-${ctx.page.lang}`, () => {
    let {__, theme} = ctx;
    let button = (theme.menu_settings.icons ? fa('fas fa-search') : '') + __('search.menu');
    return `<li class="menu-item menu-item-search"><a href="javascript:;" class="popup-trigger">${button}</a></li>`
  })
})

let headVar = [
  '<script>',
  `CONFIG.localsearch = ${JSON.stringify(config.layout)};`,
  `CONFIG.path='${config.path}';`,
  '</script>',
].join('');
injector.register('head-end', headVar);

let template = fs.readFileSync(path.join(__dirname, 'layout/local-search.ejs')).toString();
injector.register('body-end', ctx => {
  return cache.apply(`script-${ctx.page.lang}`, () => {
    let placeholder = ctx.__('search.placeholder');
    let jsPath = config.script.path;
    return ejs.render(template, {
      placeholder,
      jsPath,
      searchIcon: fa('fas fa-search'),
      closeIcon: fa('fas fa-times-circle')
    });
  })
})

injector.register('style', path.join(__dirname, 'layout/local-search.styl'));

})
