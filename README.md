# hexo-cake-local-search

[![npm](https://img.shields.io/npm/v/hexo-cake-local-search.svg)](https://www.npmjs.com/package/hexo-cake-local-search)
[![Theme](https://img.shields.io/badge/Theme-Cake:1.4.0+-blue.svg)](https://github.com/jiangtj/hexo-theme-cake)

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
  content: true
```

*More config see: [default.yaml](default.yaml)*

- **path** - Only `.json`.
- **field** - the search scope you want to search, you can chose:
  * **post** (Default) - will only covers all the posts of your blog.
  * **page** - will only covers all the pages of your blog.
  * **all** - will covers all the posts and pages of your blog.
- **format** - the form of the page contents, works with xml mode, options are:
  * **html** (Default) - original html string being minified.
  * **raw** - markdown text of each posts or pages.
  * **excerpt** - only collect excerpt.
  * **more** - act as you think.
- **limit** - define the maximum number of posts being indexed, always prefer the newest.
- **content** - whether contains the whole content of each article. If `false`, the generated results only cover title and other meta info without mainbody. By default is `true`.

## Exclude indexing

To exclude a certain post or page from being indexed, you can simply insert `indexing: false` setting at the top of its front-matter, *e.g.*:

```
title: "Code Highlight"
date: "2014-03-15 20:17:16"
tags: highlight
categories: Demo
description: "A collection of Hello World applications from helloworld.org."
toc: true
indexing: false
---
```

Then the generated result will not contain this post or page.
