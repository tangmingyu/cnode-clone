'use strict';

const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const utils = {};

utils.cryptPass = function(rawPass) {
  const salt = Math.random()
    .toString(16)
    .slice(2, 12);
  const hashPass = crypto
    .createHash('sha256')
    .update(rawPass + salt)
    .digest('hex');

  return [ hashPass, salt ];
};

utils.comparePass = function(rawPass, salt, hashPass) {
  const str = crypto
    .createHash('sha256')
    .update(rawPass + salt)
    .digest('hex');

  return str === hashPass;
};

utils.accessToken = function() {
  return uuidv1();
};

utils.retrieveKey = function() {
  return Math.random()
    .toString(16)
    .slice(2, 8);
};

utils.userSessionId = function() {
  return uuidv1();
};

utils.extractAtUsers = function(content) {
  if (!content) {
    return [];
  }

  const ignoreRegexs = [
    /```.+?```/g, // 去除单行的 ```
    /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
    /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
    /^ {4}.*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
    /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
    /\[@.+?\]\(\/.+?\)/g, // 已经被 link 的 username
  ];

  ignoreRegexs.forEach(ignore_regex => {
    content = content.replace(ignore_regex, '');
  });

  const results = content.match(/@[a-z0-9\-_]+\b/gim);
  const names = [];
  if (results) {
    for (let i = 0, l = results.length; i < l; i++) {
      let s = results[i];
      // remove leading char @
      s = s.slice(1);
      names.push(s);
    }
  }
  return [ ...new Set(names) ];
};

module.exports = utils;
