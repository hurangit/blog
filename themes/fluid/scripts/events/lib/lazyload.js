'use strict';

const joinPath = require('../../utils/join-path');

module.exports = (hexo) => {
  var config = hexo.theme.config;
  let loadingImage = 'https://unpkg.zhimg.com/chenyfan-blog@1.0.1/themes/fluid/source/img/loading.gif';
  if (!config.lazyload || !config.lazyload.enable || !loadingImage) {
    return;
  }
  if (config.lazyload.onlypost) {
    hexo.extend.filter.register('after_post_render', function(page) {
      if (page.source.search(/^_posts\/.+\.md$/) === -1 && !page.lazyload) {
        return;
      }
      page.content = lazyProcess(page.content, loadingImage);
      return page;
    });
  } else {
    hexo.extend.filter.register('after_render:html', function(str, data) {
      return lazyProcess(str, loadingImage);
    });
  }
};

const lazyProcess = (htmlContent, loadingImage) => {
  return htmlContent.replace(/<img[^>]+src="(.*?)"[^>]*>/gi, (str, p1) => {
    if (/srcset=/gi.test(str)) {
      return str;
    }
    return str.replace(p1, `${p1}" srcset="${loadingImage}`);
  });
};
