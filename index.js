const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const utils = require('hexo-cake-utils')(hexo, __dirname);

utils.loadPlugin('hexo-generator-searchdb');

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

// Add Layout
hexo.extend.filter.register('theme_inject', function(injects) {

  injects.menu.raw('local-search', `
  <li class="menu-item menu-item-search">
    <a href="javascript:;" class="popup-trigger">
      {%- if theme.menu_settings.icons %}
        <i class="menu-item-icon fas fa-search fa-fw"></i>
      {%- endif %}
      {{- __('menu.search') }}
    </a>
  </li>
  `);

  injects.head.raw('local-search', `
  <script>
  CONFIG.localsearch = {{ config.search.layout | json_encode }};
  CONFIG.path='${config.path}';
  </script>
  `);
  injects.bodyEnd.file('local-search', path.join(__dirname, 'layout/local-search.swig'));
  injects.style.push(path.join(__dirname, 'layout/local-search.styl'));

});
