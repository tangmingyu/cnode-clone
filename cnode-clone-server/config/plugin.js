'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  handlebars: {
    enable: true,
    package: 'egg-view-handlebars',
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
