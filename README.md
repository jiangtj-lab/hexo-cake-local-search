# hexo-cake-local-search

[![npm](https://img.shields.io/npm/v/hexo-cake-local-search.svg)](https://www.npmjs.com/package/hexo-cake-local-search)
[![Theme](https://img.shields.io/badge/Theme-Cake:2.2.0+-blue.svg)](https://github.com/jiangtj/hexo-theme-cake)

This is the wapper of the [hexo-generator-searchdb](https://github.com/theme-next/hexo-generator-searchdb) plug-in. Make it available in cake.

## Require

cake theme version < 2.x, install 3.   
cake theme version >= 2.x or master, install 4.x   

## Install

``` bash
yarn add hexo-cake-local-search
```

## Options

You can configure this plugin in your root `_config.yml`.

``` yaml
search:
  path: search.json
  field: post
  format: html
  limit: 10000
```

*More config see [default.yaml](default.yaml)* or [hexo-generator-searchdb](https://github.com/theme-next/hexo-generator-searchdb)
