// вспомогательный модуль
'use strict';
(function () {
  // константы и вспомогательные данные
  // экспортируемые данные:
  window.data = {
    goodsInCatalog: [],
    goodsFiltered: [],
    goodsInOrder: [],
    minPrice: null,
    maxPrice: null,
    findItemById: function (idValue, list) {
      var idValueInt = parseInt(idValue, 10);
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === idValueInt) {
          return list[i];
        }
      }
      return undefined;
    },
    initFilterCounters: function (catalogData) {
      var filterCounters = document.querySelectorAll('span.input-btn__item-count');

      // считаем количество товаров в фильтрах по типу и сотаву товара
      var kindOfGoods = ['Мороженое', 'Газировка', 'Жевательная резинка', 'Мармелад', 'Зефир', 'sugar', 'vegetarian', 'gluten'];
      for (var i = 0; i < kindOfGoods.length; i++) {
        var filtred = catalogData.filter(
            function (item) {
              if (i <= 4) {
                return (item.kind === kindOfGoods[i]);
              }
              return item.nutritionFacts[kindOfGoods[i]];
            }
        );
        filterCounters[i].textContent = '(' + filtred.length + ')';
      }
      // считаем избранное:
      var favorite = catalogData.filter(
          function (item) {
            return item.isFavorite;
          }
      );
      filterCounters[8].textContent = '(' + favorite.length + ')';
      // считаем в наличии
      var inStock = catalogData.filter(
          function (item) {
            return item.amount > 0;
          }
      );
      filterCounters[9].textContent = '(' + inStock.length + ')';
      // пишем общее количество товаров
      document.querySelector('span.range__count').textContent = '(' + catalogData.length + ')';
    },
    initSlider: function () {
      var pinSize = 10;
      document.querySelector('.range__btn--left').style.left = 0;
      document.querySelector('.range__btn--right').style.left = '235px';
      document.querySelector('.range__fill-line').style.left = pinSize + 'px';
      document.querySelector('.range__fill-line').style.right = pinSize + 'px';
      document.querySelector('.range__price--min').textContent = window.data.minPrice;
      document.querySelector('.range__price--max').textContent = window.data.maxPrice;
    }
  };

})();
