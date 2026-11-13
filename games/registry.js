/* Game registry. Each file in games/ calls SlotGames.register({...config}). See README.md. */
(function (root) {
  'use strict';
  var list = [];
  var api = {
    list: list,
    register: function (cfg) {
      if (!cfg || !cfg.id) throw new Error('Game config needs an id');
      for (var i = 0; i < list.length; i++) if (list[i].id === cfg.id) { list[i] = cfg; return cfg; }
      list.push(cfg);
      return cfg;
    },
    get: function (id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SlotGames = api;
})(this);
