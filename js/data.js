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
      var kindOfGoods = ['Мороженое', 'Газировка', 'Жевательная резинка', 'Мармелад', 'Зефир'];
      for (var i = 0; i < kindOfGoods.length; i++) {
        var filtred = catalogData.filter(
            function (item) {
              return (item.kind === kindOfGoods[i]);
            }
        );
        filterCounters[i].textContent = '(' + filtred.length + ')';
      }
      var noSugarCount = catalogData.filter(
          function (item) {
            return item.nutritionFacts.sugar === false;
          }).length;
      filterCounters[5].textContent = '(' + noSugarCount + ')';
      var vegetarianCount = catalogData.filter(
          function (item) {
            return item.nutritionFacts.vegetarian;
          }).length;
      filterCounters[6].textContent = '(' + vegetarianCount + ')';
      var noGlutenCount = catalogData.filter(
          function (item) {
            return item.nutritionFacts.gluten === false;
          }).length;
      filterCounters[7].textContent = '(' + noGlutenCount + ')';
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
    },
    updateFavoriteCounter: function (catalogData) {
      var favorite = catalogData.filter(
          function (item) {
            return item.isFavorite;
          }
      );
      document.querySelectorAll('span.input-btn__item-count')[8].textContent = '(' + favorite.length + ')';
    },
    updateInStockCounter: function (catalogData) {
      var inStock = catalogData.filter(
          function (item) {
            return (item.amount > 0);
          }
      );
      document.querySelectorAll('span.input-btn__item-count')[9].textContent = '(' + inStock.length + ')';
    },
    setCardClassAmount: function (card, amount) {
      card.classList.remove('card--in-stock');
      card.classList.remove('card--little');
      card.classList.remove('card--soon');
      switch (amount) {
        case 0:
          card.classList.add('card--soon');
          break;
        case 1: case 2: case 3: case 4:
          card.classList.add('card--little');
          break;
        default:
          card.classList.add('card--in-stock');
          break;
      }
    }
  };

})();
