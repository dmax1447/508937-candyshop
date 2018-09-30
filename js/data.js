// вспомогательный модуль
'use strict';
(function () {
  // константы и вспомогательные данные
  // экспортируемые данные:
  window.data = {
    goodsInCatalog: [],
    goodsInOrder: [],
    findItemById: function (idValue, list) {
      var idValueInt = parseInt(idValue, 10);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === idValueInt) {
          return list[i];
        }
      }
      return undefined;
    }
  };

})();
